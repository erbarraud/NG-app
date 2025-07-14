import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "./assets/globals.css"
import VueApexCharts from "vue-apexcharts"

const app = createApp(App)

app.use(router)
app.use(VueApexCharts) // This correctly registers the apexchart component globally

app.mount("#app")
