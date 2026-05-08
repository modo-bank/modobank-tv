const { chromium } = require('playwright');

const dashboards = [
  {
    nome: 'geral.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/YhMpF?rm=minimal'
  },
  {
    nome: 'comercial.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_yds5rmxw1d?rm=minimal'
  },
  {
    nome: 'crescimento.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_tswfecck2d?rm=minimal'
  },
  {
    nome: 'tarifas.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_h4lqhtil2d?rm=minimal'
  },
  {
    nome: 'ranking.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_ifsapre82d?rm=minimal'
  },
  {
    nome: 'evolucao.png',
    url: 'https://datastudio.google.com/embed/reporting/3ade70de-4dda-4e6d-9f8c-89e3376ab4f6/page/p_3a7cg1j82d?rm=minimal'
  }
];

async function tirarPrints() {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: 1920,
      height: 1080
    },
    deviceScaleFactor: 1
  });

  for (const dashboard of dashboards) {
    console.log(`Abrindo ${dashboard.nome}...`);

    await page.goto(dashboard.url, {
      waitUntil: 'networkidle',
      timeout: 120000
    });

    // Tempo extra para o Looker renderizar gráficos e tabelas
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
