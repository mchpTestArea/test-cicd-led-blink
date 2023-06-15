import { TestCaseAPIs } from "@microchip/ccl-itf/lib/apis/TestCaseAPIs";
import { ReportAPIs } from "@microchip/ccl-itf/lib/apis/ReportAPIs";
const addMsg = require("@microchip/melody-itf-reporters/lib/helper").addMsg;
const itfConfig = require("../../reports/itf.config.json");             // This file is generated automatically in root directory okay!.
import * as fse from "fs-extra";

let testAPI: TestCaseAPIs;
let reportAPI: ReportAPIs;
const devices: string[] = itfConfig.devices;
const runDir: string = itfConfig.runDir;
const LAUNCH_TIMEOUT = 500000
const TESTCASE_TIMEOUT = 900000

const setup = async () => {
    try {
        testAPI = new TestCaseAPIs();
        reportAPI = new ReportAPIs();
        await testAPI.setup(runDir);
        await reportAPI.setup(runDir);
    } catch (e) {
        throw e;
    }
}
/*
* Test cases
*/
describe("Example Name", () => {
    beforeAll(async () => {
        await setup();
        await testAPI.start();
    }, LAUNCH_TIMEOUT);

    afterAll(async () => {
        await testAPI.close();
    });

    beforeEach(async () => {
        await reportAPI.cleanupLog();
    });

    afterEach(async () => {
        const log: string = await reportAPI.getLogData();
        await addMsg(log);
    });
       
    describe.each(devices)("%s", (device) => {
        describe("CODE", () => {
            test("My Example Test", async () => {
                //write your testcase
                expect(await testAPI.loadDevice(device)).toBe(true);
                
                
                
            /*
                //Timer 2 Configuration
                const moduleIds1 = await testAPI.getModuleIdsforInterface(interfaceId_tmr2);
                expect(moduleIds1.length).toBeGreaterThan(0);
                const instance1 = moduleIds1[0];
                expect(await testAPI.loadModule(instance1)).toBe(true);
                await testAPI.setAutoModuleProperty(instance1, "main", "hardware.enableTimer", true);
                expect(await testAPI.assertAutoModuleProperty(instance1, "main", "hardware.enableTimer", true)).toBeTruthy();
                await testAPI.setAutoModuleProperty(instance1, "main", "hardware.controlMode", "Monostable");
                expect(await testAPI.assertAutoModuleProperty(instance1, "main", "hardware.trselTrst", "T2INPPS pin")).toBeTruthy();
                expect(await testAPI.assertAutoModuleProperty(instance1, "main", "hardware.tmodeThlt", "Starts on rising edge on TMR2_ers")).toBeTruthy();
                await testAPI.setAutoModuleProperty(instance1, "main", "timerClock.tcsTclkcon", "MFINTOSC 31.25khz");
                await testAPI.setAutoModuleProperty(instance1, "main", "timerClock.tckpsTcon", "1:16");
                expect(await testAPI.assertAutoModuleProperty(instance1, "main", "timerClock.toutpsTcon", "1:1")).toBeTruthy();
                await testAPI.setAutoModuleProperty(instance1, "main", "timerPeriod.userRequestedtimerPeriod", "0.1");
                await testAPI.setAutoModuleProperty(instance1, "main", "interrupt.tmri", true);*/

            

                //Generate code and save project
                expect(await testAPI.generateCode()).toBeTruthy();
                const projectName = `${device}.TST_G2.X`;
                expect(await testAPI.saveProjectAs(projectName)).toBe(true);
                
                // copy main.c and application file and Pin configuration host file 
                fse.copySync("../pic16f15244-delay-led-blink.X/main.c",`./reports/projects/${projectName}/main.c`);
				fse.copySync("../pic16f15244-delay-led-blink.X/nbproject",`./reports/projects/${projectName}/nbproject`);
                fse.copySync("../pic16f15244-delay-led-blink.X/Makefile",`./reports/projects/${projectName}/Makefile`);
                fse.copySync("../pic16f15244-delay-led-blink.X/mcc_generated_files/system/src/pins.c",`./reports/projects/${projectName}/mcc_generated_files/system/src/pins.c`);
                fse.copySync("../pic16f15244-delay-led-blink.X/mcc_generated_files/system/pins.h",`./reports/projects/${projectName}/mcc_generated_files/system/pins.h`);
                
           }, TESTCASE_TIMEOUT);
        });
    });
});