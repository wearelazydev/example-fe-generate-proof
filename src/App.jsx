import { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "Iv23liCkGlCmiYmxhyZ6";

function App() {
  const [proof, setProof] = useState({});
  const [pullRequestUrl, setPullRequestUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [rerender, setRerender] = useState(false);

  const loginWIthGithub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  };

  const claimReward = async () => {
    setIsFetching(true);

    // const urlPullRequest = "https://github.com/wearelazydev/repo-tester/pull/1";

    await fetch(
      "https://backend-wearelazydev.up.railway.app/generate-proof?url=" +
        pullRequestUrl,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProof(data);
        setIsFetching(false);
        setPullRequestUrl("");
      });
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    // console.log(codeParam);

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch(
          "https://backend-wearelazydev.up.railway.app/getAccessToken?code=" +
            codeParam,
          {
            method: "GET",
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, []);

  console.log(pullRequestUrl);

  return (
    <>
      <h1>Verify Proof</h1>
      {localStorage.getItem("accessToken") ? (
        <>
          <div>
            <button disabled={isFetching} onClick={claimReward}>
              Generate Proof
            </button>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => {
                localStorage.removeItem("accessToken");
                setRerender(!rerender);
              }}
            >
              Logout
            </button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              style={{ width: "100%", padding: "10px 5px" }}
              placeholder="Provide pull request url here..."
              onChange={(e) => setPullRequestUrl(e.target.value)}
              value={pullRequestUrl}
            />
          </div>
          {/* <pre>{proof && <h2>{proof}</h2>}</pre> */}
          <pre
            style={{
              textAlign: "left",
              padding: "20px",
              backgroundColor: "#000000",
              color: "green",
              borderRadius: "10px",
              overflow: "auto",
            }}
          >
            {proof.prProofData
              ? JSON.stringify(proof, null, 2)
              : "Waiting for proof..."}
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
