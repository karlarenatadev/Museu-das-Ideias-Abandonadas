export default function App() {
  return (
    <div className="min-h-screen bg-[#16171d] text-[#9ca3af] p-8 font-sans">
      
      {/* --- Cabeçalho do Museu --- */}
      <header className="max-w-4xl mx-auto mb-16 text-center mt-10">
        <h1 className="text-5xl font-bold text-[#f3f4f6] mb-4 tracking-tight">
          Museu das Ideias Abandonadas
        </h1>
        <p className="text-lg">
          Um cemitério digital para projetos geniais que nunca viram a luz do sol.
        </p>
      </header>

      {/* --- Área de Exposição (Grid) --- */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card de Ideia 1 */}
        <article className="bg-[#1f2028] border border-[#2e303a] p-6 rounded-2xl hover:border-[#c084fc] transition-colors shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold text-[#f3f4f6] mb-3">
            Tinder para Plantas
          </h2>
          <p className="mb-6 flex-grow">
            Um app para cruzar espécies raras de suculentas. O projeto foi abandonado por falta de engajamento das plantas.
          </p>
          <div className="mt-auto">
            <span className="inline-block bg-[rgba(192,132,252,0.15)] text-[#c084fc] px-3 py-1 rounded-full text-sm font-medium border border-[rgba(192,132,252,0.5)]">
              Desistência: 2023
            </span>
          </div>
        </article>

        {/* Card de Ideia 2 */}
        <article className="bg-[#1f2028] border border-[#2e303a] p-6 rounded-2xl hover:border-[#c084fc] transition-colors shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold text-[#f3f4f6] mb-3">
            Uber de Guarda-chuva
          </h2>
          <p className="mb-6 flex-grow">
            Pessoas te entregavam um guarda-chuva no meio do temporal. Falhou porque os motoboys também não queriam se molhar.
          </p>
          <div className="mt-auto">
            <span className="inline-block bg-[rgba(192,132,252,0.15)] text-[#c084fc] px-3 py-1 rounded-full text-sm font-medium border border-[rgba(192,132,252,0.5)]">
              Desistência: 2024
            </span>
          </div>
        </article>

        {/* Card de Ideia 3 (Para você preencher) */}
        <article className="bg-[#1f2028] border border-[#2e303a] p-6 rounded-2xl border-dashed flex items-center justify-center text-center cursor-pointer hover:bg-[#2e303a] transition-colors">
          <p className="text-[#c084fc] font-medium text-lg">
            + Adicionar nova ideia frustrada
          </p>
        </article>

      </main>

    </div>
  )
}