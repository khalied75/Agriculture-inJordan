(function () {
  const agricultureData = {
    landDistribution: {
      labels: ['Irrigated Land', 'Rain-fed Land', 'Greenhouses', 'Fruit Orchards'],
      data: [12, 45, 8, 25],
      colors: ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b']
    },
    productionTrends: {
      years: ['2018', '2019', '2020', '2021', '2022', '2023'],
      vegetables: [850, 920, 810, 950, 980, 1020],
      fruits: [650, 680, 720, 750, 790, 820]
    }
  };

  function renderCharts() {
    if (typeof Chart === 'undefined') {
      return;
    }

    const landCanvas = document.getElementById('landChart');
    if (landCanvas) {
      new Chart(landCanvas, {
        type: 'doughnut',
        data: {
          labels: agricultureData.landDistribution.labels,
          datasets: [
            {
              data: agricultureData.landDistribution.data,
              backgroundColor: agricultureData.landDistribution.colors
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const productionCanvas = document.getElementById('productionChart');
    if (productionCanvas) {
      new Chart(productionCanvas, {
        type: 'line',
        data: {
          labels: agricultureData.productionTrends.years,
          datasets: [
            {
              label: 'Vegetables (000 tons)',
              data: agricultureData.productionTrends.vegetables,
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              fill: true
            },
            {
              label: 'Fruits (000 tons)',
              data: agricultureData.productionTrends.fruits,
              borderColor: '#ff9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', renderCharts);
})();
