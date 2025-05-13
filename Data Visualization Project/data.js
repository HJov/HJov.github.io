import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProgrammingLanguageCharts = () => {
  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);
  
  useEffect(() => {
    // Our dataset about programming languages
    const programmingLanguagesData = {
      labels: ["JavaScript", "Python", "Java", "C#", "Go", "TypeScript", "PHP"],
      values: [35, 30, 20, 15, 12, 10, 8],
      // Including Dylan as requested
      users: ["Emma", "Dylan", "Michael", "Sarah", "Alex", "Taylor", "Jordan"]
    };
    
    // Create doughnut chart
    const doughnutCtx = doughnutChartRef.current.getContext('2d');
    const doughnutChart = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: programmingLanguagesData.labels,
        datasets: [{
          label: 'Number of Developers',
          data: programmingLanguagesData.values,
          backgroundColor: [
            '#FF6384', // JavaScript
            '#36A2EB', // Python
            '#FFCE56', // Java
            '#4BC0C0', // C#
            '#9966FF', // Go
            '#FF9F40', // TypeScript
            '#C9CBCF'  // PHP
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Dylan's Programming Language Survey Results (Doughnut Chart)",
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const user = programmingLanguagesData.users[context.dataIndex];
                return `${label}: ${value} votes (Top advocate: ${user})`;
              }
            }
          }
        }
      }
    });
    
    // Create horizontal bar chart
    const barCtx = barChartRef.current.getContext('2d');
    const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: programmingLanguagesData.labels,
        datasets: [{
          label: 'Popularity Score',
          data: programmingLanguagesData.values,
          backgroundColor: [
            '#FF6384', // JavaScript
            '#36A2EB', // Python
            '#FFCE56', // Java
            '#4BC0C0', // C#
            '#9966FF', // Go
            '#FF9F40', // TypeScript
            '#C9CBCF'  // PHP
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Makes the bar chart horizontal
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Programming Languages Ranked by Dylan's Team (Horizontal Bar Chart)",
            font: {
              size: 16
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.x || 0;
                const user = programmingLanguagesData.users[context.dataIndex];
                return `${label}: ${value} (Advocated by: ${user})`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Votes'
            }
          }
        }
      }
    });
    
    // Cleanup function to destroy charts when component unmounts
    return () => {
      doughnutChart.destroy();
      barChart.destroy();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Programming Language Popularity Visualization</h1>
      
      <div className="w-full max-w-2xl mb-8 bg-white p-6 rounded-lg shadow">
        <canvas ref={doughnutChartRef} height="300"></canvas>
      </div>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
        <canvas ref={barChartRef} height="300"></canvas>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p>Data collected by Dylan's Developer Survey 2025</p>
        <p>Sample size: 130 developers</p>
      </div>
    </div>
  );
};

export default ProgrammingLanguageCharts;