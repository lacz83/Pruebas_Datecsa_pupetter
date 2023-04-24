'use strict';
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

(async () => {
    //#region Acceso a la página e inicio del video
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    const recorder = new PuppeteerScreenRecorder(page);

    await page.goto('https://uninavaut1.hylandcloud.com/221appnet/Workflow/WFLogin.aspx?LifeCycleID=146&QueueID=269');
    //Bandeja aprobación correspondencia ID: 269 - Correspondencia rechazada ID: 267

    await recorder.start('./Videos/WF_Aprobación_Correspondencia_Rechazar.mp4');
    await animate(page);
    await new Promise(r => setTimeout(r, 3000));
    //#endregion

    //#region Inicio de sesión
    await page.type('input[name="username"]', 'CALIDAD')
    await page.type('input[name="password"]', 'Uninavarra2023')

    await page.screenshot({ path: './Capturas/pagina_Login_Aprobación_Correspondencia_Rechazar.png' })
    await page.click('button.btn.btn-primary.loginButton')
    await new Promise(r => setTimeout(r, 20000));
    await page.screenshot({ path: './Capturas/bandeja_Aprobación_Correspondencia_Rechazar.png' })
    console.log('Inicio de sesión e ingreso a Workflow exitoso')
    //#endregion

    //#region Ingreso a los iframe principales
    const iframeQueueProvider = await page.$('#frmWFQueueProvider')
    const ingresoQueueProvider = await iframeQueueProvider.contentFrame();

    const iframeUserInteract = await ingresoQueueProvider.$('#frmUserInteract')
    const ingresoUserInteract = await iframeUserInteract.contentFrame();

    const iframeDocuments = await ingresoQueueProvider.$('#frmDocuments');
    const ingresoDocuments = await iframeDocuments.contentFrame();

    const iframeDocProvider = await ingresoDocuments.$('#frmNAXDocProvider');
    const ingresoDocProvider = await iframeDocProvider.contentFrame();
    //#endregion

    //#region Acciones en documento prncipal
    await ingresoQueueProvider.click('button.js-refreshInboxButton.refreshInboxButton.btn-svg.success')
    console.log('Se actualiza la bandeja')
    await new Promise(r => setTimeout(r, 4000));

    await ingresoDocProvider.click('#primaryHitlist_grid_DisplayToken0')
    console.log('Se dio click en la columna Fecha/Hora Radicado')
    await new Promise(r => setTimeout(r, 4000));

    await ingresoDocProvider.type('[aria-describedby="primaryHitlist_grid_DisplayToken1"] .ui-iggrid-filtereditor', 'CE-2023-00110')
    console.log('Se filtra por el número de radicado indicado')
    await new Promise(r => setTimeout(r, 1000));

    await ingresoDocProvider.click('#primaryHitlist_grid tbody [tabindex="0"]')
    console.log('Se selecciona el documento encontrado')
    await new Promise(r => setTimeout(r, 15000));

    //#region obtener texto de un elemento especifico
    const titulo = await ingresoDocProvider.evaluate(() => {
        const visor = document.querySelector('#primaryHitlist_grid tbody').innerText;
        return visor;
    });

    console.log(titulo)
    //#endregion

    await ingresoDocuments.click('#tblAdHoc2291')
    console.log('Se da click en la tarea Rechazar')
    await new Promise(r => setTimeout(r, 10000));

    await ingresoUserInteract.click('input[name="OBBtn_Yes"]')
    console.log('Se da click en el botón Sí')
    await new Promise(r => setTimeout(r, 15000));
    //#endregion

    //#region Ingreso a los iframe secundarios
    const iframeHostFrame = await ingresoUserInteract.$('#uf_hostframe')
    const ingresoHostFrame = await iframeHostFrame.contentFrame();
    //#endregion

    //#region Acciones en Interacción de usuario
    await ingresoHostFrame.type('#motivoderechazo7_input', 'NO ESTE DIRIGIDA A LA INSTITUCIÓN')
    console.log('Se ingresa el motivo de rechazo')
    await ingresoHostFrame.click('#observaciones6_input')
    await new Promise(r => setTimeout(r, 2000));
    
    await ingresoHostFrame.type('#observaciones6_input', 'Prueba de rechazo automatizado')
    console.log('Se ingresa la observación del rechazo')
    await new Promise(r => setTimeout(r, 6000));

    await ingresoHostFrame.click('[value="Enviar"]')
    console.log('Se da click en el botón Enviar para enviar al centralizador de rechazos')
    await new Promise(r => setTimeout(r, 6000));
    //#endregion

    //#region Cierre de explorador y fin del video
    await browser.close();
    await recorder.stop();
    return;
    //#endregion

})().catch(e => console.log(e));

//#region Configuración para grabación del video
const animate = async (page) => {
    await wait(500);
    await page.evaluate(() => { window.scrollBy({ top: 500, left: 0, behavior: 'smooth' }); });
    await wait(500);
    await page.evaluate(() => { window.scrollBy({ top: 1000, left: 0, behavior: 'smooth' }); });
    await wait(1000);
};

const wait = (ms) => new Promise(res => setTimeout(res, ms));
//#endregion