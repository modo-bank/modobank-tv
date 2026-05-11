const { chromium } = require('playwright');

const dashboards = [
  {
    nome: 'geral.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/YhMpF?rm=minimal&hl=pt-BR'
  },
  {
    nome: 'comercial.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_yds5rmxw1d?rm=minimal&hl=pt-BR'
  },
  {
    nome: 'crescimento.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_tswfecck2d?rm=minimal&hl=pt-BR'
  },
  {
    nome: 'tarifas.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_h4lqhtil2d?rm=minimal&hl=pt-BR'
  },
  {
    nome: 'ranking.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_ifsapre82d?rm=minimal&hl=pt-BR'
  },
  {
    nome: 'evolucao.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_3a7cg1j82d?rm=minimal&hl=pt-BR'
  }
];

async function tirarPrints() {
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: {
      width: 1920,
      height: 1080
    },
    deviceScaleFactor: 1,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    extraHTTPHeaders: {
      'Accept-Language': 'pt-BR,pt;q=0.9'
    }
  });

  const page = await context.newPage();

  page.setDefaultNavigationTimeout(120000);

  for (const dashboard of dashboards) {
    console.log(`Abrindo ${dashboard.nome}...`);

    await page.goto(dashboard.url, {
      waitUntil: 'networkidle',
      timeout: 120000
    });

    // Remove margens do navegador e tenta encaixar melhor o relatório na viewport
    await page.evaluate(() => {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';

      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.documentElement.style.overflow = 'hidden';

      document.documentElement.style.zoom = '1.08';
    });

    // Tempo extra para o Looker renderizar gráficos/tabelas
    await page.waitForTimeout(25000);

    await page.screenshot({
      path: dashboard.nome,
      fullPage: false
    });

    console.log(`Print salvo: ${dashboard.nome}`);
  }

  await browser.close();
}

tirarPrints().catch((error) => {
  console.error('Erro ao gerar screenshots:', error);
  process.exit(1);
});
