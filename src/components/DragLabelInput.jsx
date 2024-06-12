import React, { useCallback, useEffect, useState } from "react";

function DragLabel({ value, setValue }) {
  const [snapshot, setSnapshot] = useState(value);
  const [startVal, setStartVal] = useState(null);

  const onStart = useCallback(
    (event) => {
      setStartVal(event.clientX);
      setSnapshot(value);
    },
    [value]
  );

  useEffect(() => {
    const onUpdate = (event) => {
      if (startVal !== null) {
        const newValue = snapshot + (event.clientX - startVal);
        setValue(newValue);
      }
    };

    const onEnd = () => {
      setStartVal(null);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, setValue, snapshot]);

  return (
    <span
      onMouseDown={onStart}
      style={{
        padding: 8,
        color: "gray",
        cursor: "ew-resize",
        userSelect: "none"
      }}
    >
      Count
    </span>
  );
}

export default function App() {
  const [value, setValue] = useState(0);

  const onInputChange = useCallback(
    (ev) => setValue(parseInt(ev.target.value, 10)),
    []
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          border: "1px solid #CCC",
          alignItems: "center",
          borderRadius: 4,
          fontFamily: "sans-serif",
          width: 300
        }}
      >
        <DragLabel value={value} setValue={setValue} />
        <input
          value={value}
          onChange={onInputChange}
          style={{
            flex: 1,
            padding: 8,
            border: "none",
            outline: "none"
          }}
        />
      </div>
      <p>Try to drag on the label "Count" to change the input value.</p>
    </>
  );
}
