'use strict';
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

(async () => {
    //#region Acceso a la página e inicio del video
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    const recorder = new PuppeteerScreenRecorder(page);

    await page.goto('https://uninavaut1.hylandcloud.com/221appnet/Workflow/WFLogin.aspx?LifeCycleID=146&QueueID=267');
    //Bandeja aprobación correspondencia ID: 269 - Correspondencia rechazada ID: 267

    await recorder.start('./Videos/WF_Correspondencia_Rechazada_Reasignar.mp4');
    await animate(page);
    await new Promise(r => setTimeout(r, 3000));
    //#endregion

    //#region Inicio de sesión
    //await page.type('input[name="username"]', 'AGRAJALES')
    //await page.type('input[name="password"]', 'Datecsa2023')
    //await page.type('input[name="username"]', 'JMONTANO')
    //await page.type('input[name="password"]', 'Datecsa2021')
    await page.type('input[name="username"]', 'VENTANILLAUNICA ')
    await page.type('input[name="password"]', 'Uninavarra2023')
    await page.screenshot({ path: './Capturas/pagina_Login_Correspondencia_Rechazada_Reasignar.png' })
    await page.click('button.btn.btn-primary.loginButton')
    await new Promise(r => setTimeout(r, 20000));
    await page.screenshot({ path: './Capturas/bandeja_Correspodencia_Rechazada_Reasignar.png' })
    console.log('Inicio de sesión e ingreso a Workflow exitoso')
    //#endregion

    //#region Ingreso a los iframe
    const iframeQueueProvider = await page.$('#frmWFQueueProvider')
    const ingresoQueueProvider = await iframeQueueProvider.contentFrame();

    const iframeUserInteract = await ingresoQueueProvider.$('#frmUserInteract')
    const ingresoUserInteract = await iframeUserInteract.contentFrame();

    const iframeDocuments = await ingresoQueueProvider.$('#frmDocuments');
    const ingresoDocuments = await iframeDocuments.contentFrame();

    const iframeDocProvider = await ingresoDocuments.$('#frmNAXDocProvider');
    const ingresoDocProvider = await iframeDocProvider.contentFrame();
    //#endregion

    //#region Acciones en documento principal
    await ingresoQueueProvider.click('button.js-refreshInboxButton.refreshInboxButton.btn-svg.success')
    console.log('Se actualiza la bandeja')
    await new Promise(r => setTimeout(r, 4000));

    await ingresoDocProvider.click('#primaryHitlist_grid_DisplayToken0')
    console.log('Se dio click en la columna Fecha/Hora Radicado')
    await new Promise(r => setTimeout(r, 4000));

    await ingresoDocProvider.type('[aria-describedby="primaryHitlist_grid_DisplayToken1"] .ui-iggrid-filtereditor', 'CE-2023-00109')
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

    await ingresoDocuments.click('#tblAdHoc2297')
    console.log('Se da click en la tarea Reasignar')
    await new Promise(r => setTimeout(r, 8000));

    await ingresoUserInteract.click('input[name="OBBtn_Yes"]')
    console.log('Se da click en el botón Sí')
    await new Promise(r => setTimeout(r, 10000));
    //#endregion

    //#region Ingreso al iframe secundario del formulario Unity
    const iframeHostFrame = await ingresoUserInteract.$('#uf_hostframe')
    const ingresoHostFrame = await iframeHostFrame.contentFrame();
    //#endregion

    //#region Acciones en Interacción de usuario del formulario Unity
    await ingresoHostFrame.click('#botónLimpiarDestinatario [value="Limpiar"]')
    console.log('Se da click en el botón Limpiar')
    await new Promise(r => setTimeout(r, 2000));

    await ingresoHostFrame.type('#correspondenciadirigidaa71_input', 'ÁREA')
    console.log('Se ingresa a quien va dirigido')
    await ingresoHostFrame.click('#usuariodestinatario126_input')
    await new Promise(r => setTimeout(r, 3000));

    await ingresoHostFrame.type('#busquedaporarea90_input', 'GESTION DOCUMENTAL')
    console.log('Se ingresa el área')
    await ingresoHostFrame.click('#usuariodestinatario126_input')
    await new Promise(r => setTimeout(r, 3000));

    await ingresoHostFrame.click('[value="Enviar"]')
    console.log('Se da click en el botón Enviar')
    await new Promise(r => setTimeout(r, 10000));
    //#endregion

    //#region Ingreso al iframe secundario del formulario WF
    const iframeHostFrame2 = await ingresoUserInteract.$('#uf_hostframe')
    const ingresoHostFrame2 = await iframeHostFrame2.contentFrame();
    //#endregion

    //#region Acciones en Interacción de usuario del formulario WF
    await ingresoHostFrame2.type('#observacióndereasignaciónventanilla8_input', 'Prueba reasignación automatizada')
    console.log('Se ingresa la observación de la reasignación')
    await new Promise(r => setTimeout(r, 6000));

    await ingresoHostFrame2.click('[value="Enviar"]')
    console.log('Se da click en el botón Enviar para enviar al usuario reasignado')
    await new Promise(r => setTimeout(r, 6000));
    //#endregion

    //#region comentada
    /*
    //Interactuar con la aplicación web
    //...
    await page.click('a.btn.btn-link')
    console.log(`Clicked "cancel". URL is now ${page.url()}`)
 
    await page.click('a.btn.btn-link')
    console.log(`Clicked "register". URL is now ${page.url()}`)
 
    await page.click('button.btn.btn-primary')
    let feedback = await page.$$('div.invalid-feedback');
 
    let elems = 0
    for (let i of feedback) { elems++ }
    await page.screenshot({ path: './Capturas/form-feedback.png' })
    console.log(`Clicked "Register" with an empty form. Feedback is shown in ${elems} elements`)
 
    await page.type('input[formcontrolname="firstName"]', 'Monitor');
    await page.type('input[formcontrolname="lastName"]', 'Pruebas');
    await page.type('input[formcontrolname="username"]', 'pruebas');
    await page.type('input[formcontrolname="password"]', 'MISO4208');
    await page.click('button.btn.btn-primary')
 
    await new Promise(r => setTimeout(r, 7000));
    await page.screenshot({ path: './Capturas/success-feedback.png' })
 
    feedback = await page.$("div.alert.alert-success")
    let text = await page.evaluate(el => el.textContent, feedback)
    console.log(`Success dialog after creating user with message: ${text}`)
 
    await page.type('input[formcontrolname="username"]', 'pruebas');
    await page.type('input[formcontrolname="password"]', 'MISO4208');
    await page.click('button.btn.btn-primary')
    await new Promise(r => setTimeout(r, 7000));
 
    feedback = await page.$('h1');
 
    text = await page.evaluate(el => el.textContent, feedback)
    await page.screenshot({ path: './Capturas/after-login.png' })
    console.log(`Logged in. Your user was ${text === 'Hi Monitor!' ? 'successfully' : 'not'} created`)
    */
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
