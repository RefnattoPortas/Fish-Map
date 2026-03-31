import { saveTile, saveMapRegion } from './indexeddb'

interface RegionDownloadOptions {
    name: string
    north: number
    south: number
    east: number
    west: number
    minZoom: number
    maxZoom: number
    theme: 'dark' | 'light'
    onProgress?: (current: number, total: number) => void
}

export async function downloadRegion(options: RegionDownloadOptions) {
    const { name, north, south, east, west, minZoom, maxZoom, theme, onProgress } = options
    
    const tiles: { z: number, x: number, y: number }[] = []
    
    for (let z = minZoom; z <= maxZoom; z++) {
        const xMin = long2tile(west, z)
        const xMax = long2tile(east, z)
        const yMin = lat2tile(north, z)
        const yMax = lat2tile(south, z)
        
        for (let x = xMin; x <= xMax; x++) {
            for (let y = yMin; y <= yMax; y++) {
                tiles.push({ z, x, y })
            }
        }
    }
    
    const total = tiles.length
    let downloaded = 0
    let totalSize = 0

    const baseUrl = theme === 'dark'
        ? 'https://a.basemaps.cartocdn.com/dark_all/'
        : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/'

    // Limitar concorrência para não ser bloqueado ou estourar memória
    const concurrency = 5
    for (let i = 0; i < tiles.length; i += concurrency) {
        const batch = tiles.slice(i, i + concurrency)
        await Promise.all(batch.map(async (tile) => {
            try {
                const url = `${baseUrl}${tile.z}/${tile.x}/${tile.y}.png`
                const response = await fetch(url)
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                
                const blob = await response.blob()
                totalSize += blob.size
                
                await saveTile({
                    id: `${theme}/${tile.z}/${tile.x}/${tile.y}`,
                    theme,
                    z: tile.z,
                    x: tile.x,
                    y: tile.y,
                    blob,
                    cached_at: new Date().toISOString()
                })
            } catch (err) {
                console.warn(`Erro ao baixar tile ${tile.z}/${tile.x}/${tile.y}:`, err)
            } finally {
                downloaded++
                onProgress?.(downloaded, total)
            }
        }))
    }

    // Salvar registro da região
    await saveMapRegion({
        id: crypto.randomUUID(),
        name,
        center_lat: (north + south) / 2,
        center_lng: (east + west) / 2,
        north,
        south,
        east,
        west,
        min_zoom: minZoom,
        max_zoom: maxZoom,
        tile_count: total,
        size_mb: totalSize / (1024 * 1024),
        created_at: new Date().toISOString()
    })

    return { total, size_mb: totalSize / (1024 * 1024) }
}

// Helpers Leaflet
function long2tile(lon: number, zoom: number) {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))
}

function lat2tile(lat: number, zoom: number) {
    return Math.floor(
        ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
            Math.pow(2, zoom)
    )
}
