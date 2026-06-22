import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser(null)

WebUI.navigateToUrl('https://fleeswap.vercel.app/')

WebUI.click(findTestObject('Page_Fleeswap/a_Iniciar sesin'))

WebUI.setText(findTestObject('Page_Fleeswap/input_ejemplocorreo.com'), GlobalVariable.G_UserName)

WebUI.setText(findTestObject('Page_Fleeswap/input_'), GlobalVariable.G_UserXPassword)

WebUI.click(findTestObject('Page_Fleeswap/button_Inici sesin'))

WebUI.delay(1)

WebUI.verifyElementVisible(findTestObject('Page_Fleeswap/p_Email o contrasea incorrectos'), FailureHandling.STOP_ON_FAILURE)

