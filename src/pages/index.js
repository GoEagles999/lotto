import Head from 'next/head';
import LottoNumber from '../components/LottoNumber';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tabs from '@mui/material/Tabs';
import { DataGrid } from '@mui/x-data-grid';
import Tab from '@mui/material/Tab';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
function getCookie(key) {
  var b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const szelvCost = 500;
  let hit2WinAmt = 700;
  let hit3WinAmt = 800;
  let hit4WinAmt = 900;
  let hit5WinAmt = 1000;
  const [hit2Win, sethit2Win] = useState(700);
  const [hit3Win, sethit3Win] = useState(800);
  const [hit4Win, sethit4Win] = useState(900);
  const [hit5Win, sethit5Win] = useState(1000);

  const [houseWin, setHouseWin] = useState('');
  const [kifizetes, setKifizetes] = useState('');
  const [res, setRes] = useState({});
  const [leadott, setLeadott] = useState([]);
  const [type, setType] = useState('user');
  const [szelvToGen, setSzelvToGen] = useState('');
  const [uname, setUname] = useState('user');
  const [tab, setTab] = useState(0);
  const [userBal, setUserBal] = useState(10000);
  const [adminBal, setAdminBal] = useState(0);
  const [szelveny, setSzelveny] = useState({ sz: [], jatekos: true });
  const [leadottRows, setleadottRows] = useState([]);
  useEffect(() => {
    if (res.length) {
      let rows = leadott.map((szelv, i) => {
        if (szelv.jatekos) {
          i++;
          let winAmt;
          if (szelv.hits == 0) {
            winAmt = 0;
          }
          if (szelv.hits == 2) {
            winAmt = hit2Win;
          }
          if (szelv.hits == 3) {
            winAmt = hit3Win;
          }
          if (szelv.hits == 4) {
            winAmt = hit4Win;
          }
          if (szelv.hits == 5) {
            winAmt = hit5Win;
          }
          return {
            szelveny: szelv.sz.join(', '),
            hits: szelv.hits,
            id: i,
            nyeremeny: winAmt,
          };
        }
      });
      setleadottRows(rows);
      let kiadas = 0;
      let hit1 = leadott.filter((sz) => {
        return sz.hits == 1;
      }).length;
      let hit2 = leadott.filter((sz) => {
        return sz.hits == 2;
      }).length;
      let hit3 = leadott.filter((sz) => {
        return sz.hits == 3;
      }).length;
      let hit4 = leadott.filter((sz) => {
        return sz.hits == 4;
      }).length;
      let hit5 = leadott.filter((sz) => {
        return sz.hits == 5;
      }).length;
      let nyeretlen = leadott.filter((sz) => {
        return sz.hits == 0 || sz.hits == 1;
      }).length;
      sethit2Win(hit2WinAmt / hit2);
      sethit3Win(hit3WinAmt / hit3);
      sethit4Win(hit4WinAmt / hit4);
      sethit5Win(hit5WinAmt / hit5);
      if (hit2) {
        kiadas += hit2WinAmt;
      }
      if (hit3) {
        kiadas += hit3WinAmt;
      }
      if (hit4) {
        kiadas += hit4WinAmt;
      }
      if (hit5) {
        kiadas += hit5WinAmt;
      }
      setKifizetes(kiadas);
      setHouseWin(leadott.length * szelvCost - kiadas);
    }
  }, [leadott, res]);
  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      //"delete" the old cookie
      document.cookie = `userBal=${userBal};expires=0`;
      document.cookie = `userName=${uname};expires=0`;
      document.cookie = `adminBal=${adminBal};expires=0`;
      //add the new cookie
      var expires = new Date();
      expires.setHours(expires.getHours() + 2); // expires in two hours
      document.cookie = `type=popup;expires=${expires.toUTCString()}`;
    });
  });
  useEffect(() => {
    if (!window.loaded) {
      const uB = getCookie('userBal');
      const adminB = getCookie('adminBal');
      const uN = getCookie('userName');
      if (uB) {
        setUserBal(uB);
      }
      if (adminB) {
        setAdminBal(adminB);
      }
      if (uN) {
        setUname(uN);
      }
    }
    window.loaded = true;
  });
  const szelvenyLeAd = () => {
    let tmp = new Number(userBal);
    if (tmp - szelvCost > 0) {
      setLeadott([...leadott, szelveny]);
      setUserBal(userBal - szelvCost);
      setAdminBal(adminBal + szelvCost);
      setSzelveny({ sz: [], jatekos: true });
    }
  };
  const genSzelv = () => {
    let szs = [];
    for (let i = 0; i < szelvToGen; i++) {
      let a = (Math.random() * (39 - 1) + 1).toFixed();
      let b = (Math.random() * (39 - 1) + 1).toFixed();
      let c = (Math.random() * (39 - 1) + 1).toFixed();
      let d = (Math.random() * (39 - 1) + 1).toFixed();
      let e = (Math.random() * (39 - 1) + 1).toFixed();
      let sz = { sz: [a, b, c, d, e], jatekos: false };
      szs.push(sz);
    }
    setLeadott([...leadott, ...szs]);
    setAdminBal(adminBal + szelvToGen * szelvCost);
  };
  const szelvenytHuz = () => {
    let result = new Set();
    while (result.size != 5) {
      result.add((Math.random() * (39 - 1) + 1).toFixed());
    }
    setRes(Array.from(result));
    let newLeadott = [];
    let userBalChg = 0;
    let adminBalChg = 0;
    leadott.forEach((sz, i) => {
      let hits = 0;
      sz.sz.forEach((s) => {
        Array.from(result).forEach((re) => {
          if (re == s) {
            hits += 1;
          }
        });
      });
      if (sz.jatekos) {
        if (hits == 0) {
        }
        if (hits == 2) {
          userBalChg += hit2Win;
          adminBalChg -= hit2Win;
        }
        if (hits == 3) {
          userBalChg += hit3Win;
          adminBalChg -= hit3Win;
        }
        if (hits == 4) {
          userBalChg += hit4Win;
          adminBalChg -= hit4Win;
        }
        if (hits == 5) {
          userBalChg += hit5Win;
          adminBalChg -= hit5Win;
        }
      }
      newLeadott.push({ ...sz, hits });
    });
    setAdminBal(adminBal + adminBalChg);
    setUserBal(userBal + userBalChg);
    setLeadott(newLeadott);
  };
  const ujGame = () => {
    setLeadott([]);
    setUserBal(10000);
    setAdminBal(0);
    setRes({});
  };
  const ujKor = () => {
    setLeadott([]);
    setRes({});
  };
  const Navbar = () => {
    return (
      <FormControl>
        <RadioGroup
          row
          onChange={(e) => setType(e.target.value)}
          value={type}
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="user" control={<Radio />} label="User" />
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>
      </FormControl>
    );
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navbar />
        {type == 'user' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Tabs
              value={tab}
              onChange={(e, n) => setTab(n)}
              aria-label="basic tabs example"
            >
              <Tab label="Szelveny leadasa" />
              <Tab label="Leadott szelvenyek" />
            </Tabs>
            <TextField
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              fullWidth
              label="Username"
              id="fullWidth"
            />
            {tab == 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {szelveny.length < 5 && (
                  <h2 style={{ margin: '15px' }}>Pick 5 numbers</h2>
                )}
                {userBal - szelvCost < 0
                  ? `You don't have enough credits to place a bet.`
                  : ''}
                <h3>Your balance: {userBal}</h3>
                {userBal - szelvCost > 0 && (
                  <>
                    <div>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        return (
                          <LottoNumber
                            num={num}
                            szelveny={szelveny}
                            setSzelveny={setSzelveny}
                          />
                        );
                      })}
                    </div>
                    <div>
                      {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => {
                        return (
                          <LottoNumber
                            num={num}
                            szelveny={szelveny}
                            setSzelveny={setSzelveny}
                          />
                        );
                      })}
                    </div>
                    <div>
                      {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((num) => {
                        return (
                          <LottoNumber
                            num={num}
                            szelveny={szelveny}
                            setSzelveny={setSzelveny}
                          />
                        );
                      })}
                    </div>
                    <div>
                      {[31, 32, 33, 34, 35, 36, 37, 38, 39].map((num) => {
                        return (
                          <LottoNumber
                            num={num}
                            szelveny={szelveny}
                            setSzelveny={setSzelveny}
                          />
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        onClick={(e) => {
                          szelvenyLeAd();
                        }}
                      >
                        Szelveny leadasa
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            {tab == 1 && (
              <div>
                {res.length > 0 ? (
                  <DataGrid
                    style={{ width: '500px', height: '500px' }}
                    rows={leadottRows}
                    columns={[
                      { field: 'szelveny', headerName: 'Szelveny', width: 150 },
                      {
                        field: 'hits',
                        headerName: 'Talalatok',
                        width: 150,
                      },
                      {
                        field: 'nyeremeny',
                        headerName: 'Nyeremeny',
                        width: 150,
                      },
                    ]}
                  />
                ) : (
                  leadott.map((szelv, i) => {
                    if (szelv.jatekos) {
                      i++;
                      let winAmt;
                      if (szelv.hits == 0) {
                        winAmt = 0;
                      }
                      if (szelv.hits == 2) {
                        winAmt = hit2Win;
                      }
                      if (szelv.hits == 3) {
                        winAmt = hit3Win;
                      }
                      if (szelv.hits == 4) {
                        winAmt = hit4Win;
                      }
                      if (szelv.hits == 5) {
                        winAmt = hit5Win;
                      }
                      return (
                        <div>
                          {i}. szelveny: {szelv.sz.join(', ')}
                          talalatok: {szelv.hits}
                          nyeremeny: {winAmt}
                        </div>
                      );
                    }
                  })
                )}
              </div>
            )}
          </div>
        )}
        {type == 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {' '}
            <div>Your balance: {adminBal}</div>
            <TextField
              value={szelvToGen}
              onChange={(e) => setSzelvToGen(Number(e.target.value))}
              fullWidth
              label="Szelveny generalas (szelvenyek szama)"
              id="fullWidth"
            />
            <Button
              onClick={(e) => {
                genSzelv();
              }}
            >
              Generalj
            </Button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              Leadott szelvenyek
              {leadott
                .sort((a, b) => !a.jatekos)
                .map((sz) => {
                  return (
                    <div>
                      {sz.sz.join(', ')} - Jatekos:{' '}
                      {sz.jatekos ? 'igen' : 'nem'}- talalatok: {sz.hits}
                    </div>
                  );
                })}
            </div>
            <div></div>
            <Button
              onClick={() => {
                szelvenytHuz();
              }}
            >
              Szelveny huzas
            </Button>
            <div style={{ fontSize: '25px' }}>Huzott szamok:</div>
            <div>{res?.length > 0 && res.join(', ')}</div>
            {res?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '25px' }}>Kimutatas</div>
                <div class="szelvHits">5-os szelvenyek:</div>
                {
                  leadott.filter((sz) => {
                    return sz.hits == 5;
                  }).length
                }{' '}
                <br />
                Nyeremeny szelvenyenkent:
                {leadott.filter((sz) => {
                  return sz.hits == 5;
                }).length == 0
                  ? 'Nincs kifizetett szelveny'
                  : hit5Win.toFixed(0)}
                <div class="szelvHits">4-es szelvenyek:</div>
                {
                  leadott.filter((sz) => {
                    return sz.hits == 4;
                  }).length
                }{' '}
                <br />
                Nyeremeny szelvenyenkent:
                {leadott.filter((sz) => {
                  return sz.hits == 4;
                }).length == 0
                  ? 'Nincs kifizetett szelveny'
                  : hit4Win.toFixed(0)}
                <div class="szelvHits">3-as szelvenyek:</div>
                {
                  leadott.filter((sz) => {
                    return sz.hits == 3;
                  }).length
                }{' '}
                <br />
                Nyeremeny szelvenyenkent:
                {leadott.filter((sz) => {
                  return sz.hits == 3;
                }).length == 0
                  ? 'Nincs kifizetett szelveny'
                  : hit3Win.toFixed(0)}
                <div class="szelvHits">2-es szelvenyek:</div>
                {
                  leadott.filter((sz) => {
                    return sz.hits == 2;
                  }).length
                }{' '}
                <br />
                Nyeremeny szelvenyenkent:
                {leadott.filter((sz) => {
                  return sz.hits == 2;
                }).length == 0
                  ? 'Nincs kifizetett szelveny'
                  : hit2Win.toFixed(0)}
                <div>Nyeretlen:</div>
                {
                  leadott.filter((sz) => {
                    return sz.hits == 0 || sz.hits == 1;
                  }).length
                }
                <div>Az összes szelvény száma: {leadott.length}</div>
                <div>
                  Az összes szelvény után járó bevétel:{' '}
                  {leadott.length * szelvCost}
                </div>
                <div>
                  Az összes találatra összesen kifizetendő összeg:{kifizetes}{' '}
                </div>
                <div>Az üzemeltető nyeresége: {houseWin}</div>
              </div>
            )}
          </div>
        )}
        <Button
          onClick={(e) => {
            ujGame();
          }}
        >
          New game
        </Button>
        <Button
          onClick={(e) => {
            ujKor();
          }}
        >
          New round
        </Button>
      </main>
    </>
  );
}
