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

WebUI.navigateToUrl('https://www.demoblaze.com/')

WebUI.click(findTestObject('Page_STORE/a_itemc'))

WebUI.click(findTestObject('Page_STORE/a_Samsung galaxy s6'))

WebUI.click(findTestObject('Page_STORE/a_Add to cart'))

WebUI.delay(2)

WebUI.acceptAlert()

WebUI.click(findTestObject('Page_STORE/a_cartur'))

WebUI.click(findTestObject('Page_STORE/button_Place Order'))

WebUI.setText(findTestObject('Page_STORE/input_Total_ 360'), 'Nombre Completo')

WebUI.setText(findTestObject('Page_STORE/input_Country'), 'Pais')

WebUI.setText(findTestObject('Page_STORE/input_City'), 'Ciudad')

WebUI.setText(findTestObject('Page_STORE/input_Credit card'), '4511555879521458')

WebUI.setText(findTestObject('Page_STORE/input_Month'), '12')

WebUI.setText(findTestObject('Page_STORE/input_Year'), '29')

WebUI.click(findTestObject('Page_STORE/button_Purchase'))

WebUI.click(findTestObject('Page_STORE/button_OK'))

WebUI.click(findTestObject('Page_STORE/a_cartur_1'))

