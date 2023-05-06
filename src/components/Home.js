import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import BallIcon from "../utils/ball.png";
import FixturesCard from "../utils/fixtures.jpg";
import ResultsCard from "../utils/results.jpg";
import TableCard from "../utils/table.jpg";
import Logo from "../utils/icon.png";
import Fixtures from "./Fixtures";
import Results from "./Results";
import Stats from "./Stats";
import Card from "react-bootstrap/Card";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://stoppage-time-server.vercel.app/";

const Home = () => {
  const [spin, setSpin] = useState(false);
  const [matches, setMatches] = useState({ matches: [], teamCrest: [] });
  const [results, setResults] = useState({ results: [], teamCrest: [] });
  const [today, setToday] = useState("");
  const [page, setPage] = useState("");
  const [stats, setStats] = useState({ scorers: [], standings: [] });
  const [teamsCrest, setTeamsCrest] = useState([]);

  useEffect(() => {
    setSpin(true);
    getUser(localStorage.getItem("username")).then((res) => {
      console.log(res.today);

      const formattedMatches = res.matches.map((match) => {
        const matchId = match.id;

        const homeTeam = match.homeTeam.name;
        const homeTeamCrest = match.homeTeam.crest;
        const awayTeam = match.awayTeam.name;
        const awayTeamCrest = match.awayTeam.crest;
        const matchday = match.matchday;
        const date = new Date(match.utcDate);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        const formattedTime = `${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

        return {
          matchId,
          homeTeam,
          homeTeamCrest,
          awayTeam,
          awayTeamCrest,
          matchday,
          date: `${formattedDate} ${formattedTime}`,
        };
      });

      const teamCrests = formattedMatches.reduce((acc, match) => {
        const { homeTeam, homeTeamCrest } = match;
        if (!acc[homeTeam]) {
          acc[homeTeam] = homeTeamCrest;
        }
        return acc;
      }, {});

      const formattedResults = res.results.map((match) => {
        const matchId = match.id;
        const homeTeam = match.homeTeam.name;
        const homeTeamCrest = match.homeTeam.crest;
        const awayTeam = match.awayTeam.name;
        const awayTeamCrest = match.awayTeam.crest;
        const matchday = match.matchday;
        const score = `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
        const date = new Date(match.utcDate);
        const competition = match.competition.emblem;
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;

        return {
          matchId,
          homeTeam,
          homeTeamCrest,
          awayTeam,
          awayTeamCrest,
          matchday,
          score,
          date: `${formattedDate}`,
          competition,
        };
      });
      if (res.today != "none") {
        const date = new Date(res.today.utcDate);

        const formattedTime = `${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

        setToday({
          matchId: res.today.id,
          homeTeam: res.today.homeTeam.name,
          homeTeamCrest: res.today.homeTeam.crest,
          awayTeam: res.today.awayTeam.name,
          awayTeamCrest: res.today.awayTeam.crest,
          matchday: res.today.matchday,
          date: `${formattedTime}`,
        });
      }
      setResults({ results: formattedResults, teamCrests: teamCrests });
      setMatches({ matches: formattedMatches, teamCrests: teamCrests });
      setSpin(false);
    });

    if (page === "Stats") {
      setSpin(true);
      getStats().then((res) => {
        const standings = res.standings;
        const topScorers = res.scorers.map((player) => {
          const playerName = player.player.name;
          const team = player.team;
          const goals = player.goals;
          const assists = player.assists;
          return {
            playerName,
            team,
            goals,
            assists,
          };
        });
        setStats({ scorers: topScorers, standings: standings });
        setSpin(false);
      });
    }
  }, [page === "Stats"]);

  async function logout() {
    const response = await fetch(`${BASE_URL}logout`);
    window.location.reload();
  }

  async function getUser(username) {
    const response = await fetch(`${BASE_URL}user?username=${username}`);
    const data = await response.json();
    return data;
  }

  async function getStats() {
    const response = await fetch(`${BASE_URL}stats`);
    const data = await response.json();

    return data;
  }

  async function logout() {
    localStorage.removeItem('username');
    window.location.reload();
  }

  async function getUser(username) {
    const response = await fetch(`${BASE_URL}user?username=${username}`);
    const data = await response.json();
    return data;
  }

  async function getUsername() {
    try {
      const response = await fetch(`${BASE_URL}get_username`);
      const data = await response.json();
      console.log(data); // Log the response data to the console
      return data.username;
    } catch (error) {
      console.error(error); // Log any errors to the console
      return null;
    }
  }

  async function getStats() {
    const response = await fetch(`${BASE_URL}stats`);
    const data = await response.json();

    return data;
  }

  return (
    <>
      <div className="bg-image">
        <Navbar
          style={{ backgroundColor: "rgba(15, 32, 40, 255)" }}
          expand="lg"
        >
          <Container>
            <Navbar.Brand style={{ color: "white" }} href="/">
              <img
                src={Logo}
                alt="Stoppage Time Logo"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Stoppage Time
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link onClick={() => setPage("Fixtures")}>
                  Fixtures
                </Nav.Link>
                <Nav.Link onClick={() => setPage("Results")}>Results</Nav.Link>
                <Nav.Link onClick={() => setPage("Stats")}>Stats</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="#" onClick={logout}>
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          {spin ? (
            <div className="loading-ball">
              <img id="ball-spinner" src={BallIcon} alt="Image description" />
            </div>
          ) : page == "" ? (
            <div className="blurred-box">
              {today ? (
                <div>
                  <h3>
                    {today.homeTeam}
                    <img
                      className="front-logo"
                      src={today.homeTeamCrest}
                      alt="Home Team Crest"
                    />
                    <img
                      className="front-logo"
                      src={today.awayTeamCrest}
                      alt="Away Team Crest"
                    />
                    {today.awayTeam}
                  </h3>
                  <h4>TODAY {today.date}</h4>
                </div>
              ) : (
                <>
                  <div className="home-cards">
                    <Card style={{ width: "18rem" }} bg="dark">
                      <Card.Img variant="top" src={FixturesCard} />
                      <Card.Body>
                        <Card.Title>Fixtures</Card.Title>
                        <Card.Text>
                          Check out the remaining La Liga fixtures for the
                          current season. See which teams are set to face off in
                          the coming weeks and make sure you don't miss any of
                          the action with our fixtures page.
                        </Card.Text>
                        <button
                          className="button-6"
                          onClick={() => setPage("Fixtures")}
                        >
                          Fixtures
                        </button>
                      </Card.Body>
                    </Card>
                    <Card style={{ width: "18rem" }} bg="dark">
                      <Card.Img variant="top" src={ResultsCard} />
                      <Card.Body>
                        <Card.Title>Results</Card.Title>
                        <Card.Text>
                          Stay up-to-date with the latest La Liga results for
                          the current season. See how your favorite team are
                          performing and keep track of your team's rivals with
                          our comprehensive results page.
                        </Card.Text>
                        <button
                          className="button-6"
                          onClick={() => setPage("Results")}
                        >
                          Results
                        </button>
                      </Card.Body>
                    </Card>
                    <Card style={{ width: "18rem" }} bg="dark">
                      <Card.Img variant="top" src={TableCard} />
                      <Card.Body>
                        <Card.Title>Stats</Card.Title>
                        <Card.Text>
                          Check out the latest La Liga standings and keep track
                          of your favorite team's progress throughout the season
                          with our comprehensive Stats page. Our page also
                          features the top scorer table, so you can see who's
                          leading the race for the Golden Boot.
                        </Card.Text>
                        <button
                          className="button-6"
                          onClick={() => setPage("Stats")}
                        >
                          Stats
                        </button>
                      </Card.Body>
                    </Card>
                  </div>
                </>
              )}
            </div>
          ) : page === "Fixtures" ? (
            <Fixtures data={matches} />
          ) : page === "Results" ? (
            <Results data={results} />
          ) : page === "Stats" ? (
            <Stats stats={stats} />
          ) : (
            ""
          )}
        </Container>
      </div>
    </>
  );
};

export default Home;
