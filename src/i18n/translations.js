export const translations = {
  pt: {
    common: {
      loading: 'Carregando...',
      error: 'Erro:',
      lastUpdated: 'Última atualização:',
      tryAgain: 'Tente novamente mais tarde',
      viewDetails: 'Ver detalhes',
      price: 'Preço',
      marketCap: 'Cap. de Mercado',
      volume: 'Volume 24h',
      change24h: 'Variação 24h',
      supply: 'Fornecimento',
      maxSupply: 'Fornecimento Máximo',
      unlimited: 'Ilimitado',
      allTimeHigh: 'Máxima Histórica',
      allTimeLow: 'Mínima Histórica',
      calculator: 'Calculadora',
      amount: 'Quantidade',
      from: 'De',
      to: 'Para',
      select: 'Selecione',
      convert: 'Converter',
      priceHistory: 'Histórico de Preços (7 dias)',
      additionalInfo: 'Informações Adicionais',
      circulatingSupply: 'Fornecimento Circulante',
      bestPerformer: 'Melhor Desempenho (24h)',
      quickConvert: 'Conversão Rápida',
    },
    header: {
      cryptoPrices: 'Preços das Criptomoedas',
      calculator: 'Calculadora',
    },
    footer: {
      about: 'Sobre',
      aboutText: 'CurrencyTracker é uma plataforma de rastreamento de criptomoedas em tempo real que fornece dados precisos e atualizados do mercado.',
      resources: 'Recursos',
      api: 'API',
      documentation: 'Documentação',
      support: 'Suporte',
      legal: 'Legal',
      privacy: 'Privacidade',
      terms: 'Termos de Uso',
      disclaimer: 'Aviso Legal',
      disclaimerText: 'As informações fornecidas neste site são apenas para fins informativos e não constituem aconselhamento financeiro.',
      poweredBy: 'Desenvolvido com dados de',
      rights: 'Todos os direitos reservados',
    }
  }
}

export function useTranslation() {
  // For now, we'll just return Portuguese translations
  return {
    t: (key) => {
      const keys = key.split('.')
      let value = translations.pt
      for (const k of keys) {
        value = value[k]
        if (!value) return key
      }
      return value
    }
  }
}
