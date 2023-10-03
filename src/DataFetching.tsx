import { useEffect, useRef, useState } from "react";

type Beer = {
  id: number;
  brand: string;
  name: string;
  yeast: string;
  malts: string;
  alcohol: string;
};

const _fetch = (cnt: number): Promise<{ data: any; cnt: number }> => {
  return fetch("https://random-data-api.com/api/v2/beers").then((res) => {
    return { data: res.json(), cnt };
  });
};

export default function DataFetching() {
  const [beer, setBeer] = useState<Beer | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(
      `RenderCount No.${renderCount.current}: Render: ` +
        new Date().toISOString()
    );
  });

  useEffect(() => {
    let ignore = false;
    _fetch(renderCount.current)
      .then((res) => {
        const { data, cnt }: { data: Beer; cnt: number } = res;
        console.log(
          `RenderCount No.${cnt}: Data fetch: ` + new Date().toISOString(),
          { ignore }
        );
        if (!ignore) {
          setLoading(false);
          setBeer(data);
          console.log(
            `RenderCount No.${cnt}: setData: ` + new Date().toISOString()
          );
        } else {
          console.log(
            `RenderCount No.${cnt}: Ignored: ` + new Date().toISOString()
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong");
      });
    return () => {
      ignore = true;
      console.log(
        `RenderCount No.${renderCount.current}: Clean up: ` +
          new Date().toISOString(),
        { ignore }
      );
    };
  }, []);

  if (error) return <div>{error}</div>;

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <p>id: {beer?.id}</p>
      <p>brand: {beer?.brand}</p>
      <p>name: {beer?.name}</p>
      <p>yeast: {beer?.yeast}</p>
      <p>malts: {beer?.malts}</p>
      <p>alcohol: {beer?.alcohol}</p>
      <p>num: {beer?.num}</p>
    </div>
  );
}
