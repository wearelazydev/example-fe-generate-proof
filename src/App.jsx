import { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "Iv23liCkGlCmiYmxhyZ6";

function App() {
  const [proof, setProof] = useState({});

  const loginWIthGithub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  };

  const claimReward = async () => {
    const urlPullRequest = "https://github.com/wearelazydev/repo-tester/pull/1";

    await fetch("backend-wearelazydev.up.railway.app/generate-proof?url=" + urlPullRequest, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProof(data);
      });
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    // console.log(codeParam);

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("backend-wearelazydev.up.railway.app/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              // setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, []);

  return (
    <>
      <h1>Verify Proof</h1>
      {localStorage.getItem("accessToken") ? (
        <>
          <button onClick={claimReward}>Generate Proof</button>
          {/* <pre>{proof && <h2>{proof}</h2>}</pre> */}
          <pre style={{ textAlign: "left", padding: "20px", backgroundColor: "#000000", color: "green", borderRadius: "10px", overflow: "auto" }}>
            {proof && JSON.stringify(proof, null, 2)}
          </pre>
        </>
      ) : (
        <>
          <button onClick={loginWIthGithub}>Connect GitHub</button>
        </>
      )}
    </>
  );
}

export default App;
