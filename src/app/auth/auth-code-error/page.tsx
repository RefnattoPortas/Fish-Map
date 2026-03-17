import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ details?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const details = resolvedSearchParams.details || 'Ocorreu um erro desconhecido.'


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-neutral-700">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Erro na Autenticação</h1>
        <p className="text-neutral-400 mb-6">
          Não foi possível concluir o login. Por favor, tente novamente.
        </p>
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded text-sm text-left text-red-400 mb-8 overflow-x-auto">
          <code>{details}</code>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  )
}
