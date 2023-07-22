import React, { useEffect, useState, useContext } from "react";
import ChartComponent from "../components/ChartComponent";
import { AuthContext } from "../context/auth.context";
import Gallery from "../components/GalleryComponent";
<compo></compo>

const API_URL = "http://localhost:5005";

function HomePage() {
  const { user } = useContext(AuthContext);

  // Variável para controlar o status de login
  const isLoggedIn = !!user;

  return (
<div className="HomePage" style={{ overflow: "hidden" }}>
      {isLoggedIn ? (
        // Se estiver logado, exibe as informações do usuário e o gráfico
        <div>
          <h2>Hi, {user.name}</h2>
          <div>
            <img
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW0zNHo4bThvY2U4ODIyc205bjJiMGg2dGZubHlmdHIxdGJrbnplNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/74jItvcH8xlnijTlBV/giphy.gif"
              alt="GIF animado"
              style={{ width: 300 }}
            />
          </div>
          <div>
            <h3>Check the progress of your projects</h3>
            <ChartComponent />
          </div>

          <div className="projectsDisplayContainer" style={{ width: "400px", margin:"20px"}}>
          <Gallery />

            </div>

          {/* Slider horizontal com lista de projetos */}
          {/* Aqui você pode inserir o componente de slider */}
          {/* Exemplo: <SliderComponent projects={projectList} /> */}

          {/* Quadro com principais atividades do dia */}
          <div>
            <h2>Today's tasks</h2>
            <div
              className="tasksDay"
              style={{ width: 200, height: 200, border: "2px solid black" }}
            >
              <h4>aqui vão tasks</h4>
            </div>
            {/* <ul> */}
            {/* Aqui você pode mapear as atividades do dia */}
            {/* Exemplo: 
            {dailyActivities.map((activity) => (
              <li key={activity.id}>{activity.description}</li>
            ))}
          */}
            {/* </ul> */}
          </div>

          {/* Botões abaixo do quadro de atividades */}
          <div>
            {/* Botão "See your daily log" */}
            <button>See your daily log</button>

            {/* Botão "Add a new daily log" */}
            <button>Add a new daily log</button>
          </div>
        </div>
      ) : (
        // Se estiver deslogado, exibe uma mensagem de boas-vindas ou redireciona para outra página
        <div>
          <h2>Welcome! Please log in to access your account.</h2>
          {/* ... Resto do conteúdo para usuários deslogados ... */}
        </div>
      )}
    </div>
  );
}

export default HomePage;
