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

'Explorar - Seccion de todos los productos '
WebUI.click(findTestObject('Page_Fleeswap/button_Explorar'))

'Explorar - Seccion de todos los productos (solo venta)'
WebUI.click(findTestObject('Page_Fleeswap/button_filter-type-label'))

'Esperar que se carguen los productos'
WebUI.delay(3)

'Explorar - Seccion de todos los productos (solo trueque)'
WebUI.click(findTestObject('Page_Fleeswap/button_filter-type-label_1'))

'Esperar que se carguen los productos'
WebUI.delay(3)

'Explorar - Seccion de todos los productos (ambos)'
WebUI.click(findTestObject('Page_Fleeswap/button_filter-type-label_2'))

'Esperar que se carguen los productos'
WebUI.delay(3)

