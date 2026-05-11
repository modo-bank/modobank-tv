const { chromium } = require('playwright');
const sharp = require('sharp');

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

async function tratarImagem(arquivo) {
  const temp = `temp-${arquivo}`;

  await sharp(arquivo)
    .extract({
      left: 70,
      top: 0,
      width: 1780,
      height: 1048
    })
    .resize(1920, 1080, {
      fit: 'fill'
    })
    .png()
    .toFile(temp);

  await sharp(temp).toFile(arquivo);
}

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

    await page.waitForTimeout(25000);

    await page.screenshot({
      path: dashboard.nome,
      fullPage: false
    });

    await tratarImagem(dashboard.nome);

    console.log(`Print salvo e ajustado: ${dashboard.nome}`);
  }

  await browser.close();
}

tirarPrints().catch((error) => {
  console.error('Erro ao gerar screenshots:', error);
  process.exit(1);
});
