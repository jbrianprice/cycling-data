import React, { useEffect, useRef, useState } from "react"
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    registerables,
} from "chart.js"
import { Line, PolarArea } from "react-chartjs-2"
import Papa from "papaparse"
import Palette from "./colors"

Chart.register(
    ...registerables,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export const options = {
    responsive: true,
    plugins: {
        legend: false,
        title: false,
        // legend: {
        //     position: "top",
        // },
        // title: {
        //     display: true,
        //     text: "Chart.js Line Chart",
        // },
    },
}

const PowerBalannceChart = () => {
    const [labels, setLabels] = useState([])
    const [leftBalance, setLeftBalance] = useState([])
    const [rightBalance, setRightBalance] = useState([])
    const [dataset, setDataset] = useState([])
    const [types, setTypes] = useState([])
    const [chartData, setChartData] = useState([])
    const [metric, setMetric] = useState(0)
    

    // initialize chart
    const chartContainer = useRef(null)
    const [chartInstance, setChartInstance] = useState(null)

    const data = {
        labels,
        datasets: chartData.length > 1 ? [chartData[metric]] : chartData,
    }

    const chartConfig = {
        options: options,
        type:"line",
        data: data
    }

    const handle = {
        parseUpload: (e) => {
            const files = e.target.files
            if (files) {
                Papa.parse(files[0], {
                    complete: function (results) {
                        setLeftBalance(results.data.map((value, i) => value[12]))
                        setLabels(results.data.map((value, i) => new Date(value[0] * 1000)))
                        setTypes(results.data[0])
                        setDataset(results.data[0].map((_, i) => results.data.map((row) => row[i])))
                        // setDataset(
                        //     [results.data[0].map((column, i) => column + results.data[i] )

                        //     ]);
                    },
                })
            }
        },
    }

    useEffect(() => {
        setChartData(
            dataset.map((set, i) => ({
                label: set[0],
                data: set.slice(0),
                borderColor: Palette.rgba(1)[i],
                backgroundColor: Palette.rgba(0.5)[i],
            }))
        )
    }, dataset)

    useEffect(() => {
        if (chartInstance !== null) {
            chartInstance.destroy()
        }
        const newChartInstance = new Chart(chartContainer.current, chartConfig)
        setChartInstance(newChartInstance)
    }, dataset)

    console.group("data")
    console.log(chartInstance)
    console.log(chartContainer)
    console.log("types", types)
    console.log("dataset", dataset)
    console.log("chart data", data)
    console.log("metric", chartData[metric])
    console.groupEnd()

    return (
        <>
            <div className="rounded bg-gray-500 px-4 py-2 flex items-center gap-2">
                <input type="file" accept=".csv,.xlsx,.xls" onChange={handle.parseUpload} />
                <label className="text-white ml-auto" for="charts">
                    Choose a metric:
                </label>
                <select
                    className="rounded p-2"
                    name="chart"
                    id="cars"
                    form="chartform"
                    onChange={(e) => setMetric(e.target.value)}
                >
                    {types.map((metric, i) => (
                        <option value={i}>{metric}</option>
                    ))}
                </select>
            </div>

            <canvas ref={chartContainer} />
            <Line options={options} data={data} />
        </>
    )
}

export default PowerBalannceChart
