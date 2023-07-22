import React from "react";
import { PieChart, Pie, Cell } from "recharts";

function ChartComponent({ data }) {
  // Dados falsos para o gráfico
  const chartData = [
    { name: "Concluído", value: 80 },
    { name: "Pendente", value: 20 },
  ];

  return (
    <div>
      <PieChart width={200} height={200}>
        <Pie
          dataKey="value"
          data={data || chartData} // Utiliza os dados reais se disponíveis, caso contrário, utiliza os dados falsos
          cx={100}
          cy={100}
          outerRadius={80}
          fill="#8884d8"
        >
          <Cell fill="#6125FC" />
          <Cell fill="#3B85BB" />
        </Pie>
      </PieChart>
    </div>
  );
}

export default ChartComponent;
