async function getAnalyticsData() {
    const response = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/480358800:runReport', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer AIzaSyBlaMTfxdJphVb6qChXdksW7obCV44Uv3Q',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
            "metrics": [{"name": "activeUsers"}]
        })
    });

    const data = await response.json();
    document.getElementById("visitas").innerText = `Visitas: ${data.rows[0].metricValues[0].value}`;
}

// Llamar la función al cargar la página
getAnalyticsData();
