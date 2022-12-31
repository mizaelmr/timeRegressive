import * as React from 'react';
import './style.css';

const useTimer = () => {
  const [available, setAvailable] = React.useState(false);
  const [expirationInSeconds, setExpirationInSeconds] = React.useState<
    number | null
  >(null);

  const startTime = (expirationDate: Date) => {
    const now = Date.now();
    const maxDate = expirationDate.getTime();
    setExpirationInSeconds(Math.floor((maxDate - now) / 1000));
  };

  React.useEffect(() => {
    if (expirationInSeconds === null) return;

    const timeoutId = setTimeout(() => {
      setExpirationInSeconds((seconds) => seconds - 1);
    }, 1000);

    if (expirationInSeconds <= 0) {
      setExpirationInSeconds(null);
      clearTimeout(timeoutId);
      setAvailable(true);
      return;
    }

    return () => clearTimeout(timeoutId);
  }, [expirationInSeconds]);

  // 00:00
  const seconds = expirationInSeconds % 60;
  const minutes = Math.floor(expirationInSeconds / 60);
  const minutesString = String(minutes).padStart(2, '0');
  const secondsString = String(seconds).padStart(2, '0');
  const timeString = `${minutesString}:${secondsString}`;

  return { seconds: expirationInSeconds, available, startTime, timeString };
};

const getExpiration = (): Promise<Date> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(new Date('2022-12-31T01:37:00.000Z')), 2000);
  });
};

export default function App() {
  const { seconds, timeString, available, startTime } = useTimer();

  const requestToken = async () => {
    const expiration = await getExpiration();
    startTime(expiration);
  };

  return (
    <div>
      {seconds === null && (
        <button onClick={requestToken}>Receber Código</button>
      )}
      {seconds !== null && (
        <React.Fragment>
          <p>Enviar novamente em {timeString}</p>
          <button onClick={requestToken} disabled={available === false}>
            Enviar novamente
          </button>
        </React.Fragment>
      )}
    </div>
  );
}
