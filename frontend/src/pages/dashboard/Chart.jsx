import React, { useEffect } from "react";

const MyDailyActivitiesChart = () => {
	useEffect(() => {
		const loadGoogleCharts = () => {
			const script = document.createElement("script");
			script.src = "https://www.gstatic.com/charts/loader.js";
			script.async = true;
			script.onload = () => {
				window.google.charts.load("current", { packages: ["corechart"] });
				window.google.charts.setOnLoadCallback(drawChart);
			};
			document.body.appendChild(script);
		};

		const drawChart = () => {
			const data = window.google.visualization.arrayToDataTable([
				["Task", "Hours per Day"],
				["Work", 11],
				["Eat", 2],
				["Commute", 2],
				["Watch TV", 2],
				["Sleep", 7],
			]);

			const options = {
				title: "My Daily Activities",
				is3D: true,
			};

			const chart = new window.google.visualization.PieChart(
				document.getElementById("piechart_3d")
			);
			chart.draw(data, options);
		};

		loadGoogleCharts();
	}, []);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div
				id="piechart_3d"
				className="w-[900px] h-[500px] shadow-lg border rounded-lg bg-white p-4"
			></div>
		</div>
	);
};

export default MyDailyActivitiesChart;