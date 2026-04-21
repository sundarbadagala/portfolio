import "./styles.css";

export default function RadioExample({ handleChange, question, options }: any) {
  const onChange = (item: any) => {
    handleChange(item);
  };
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: question }} />
      {options.map((item: any) => (
        <>
          <label htmlFor={item.option_id} className="radio-label">
            <input
              type="radio"
              value={item.value}
              id={item.option_id}
              name="options"
              onChange={() => onChange(item)}
            />
            <span className="custom-radio" />
            {item.label}
          </label>
        </>
      ))}
    </>
  );
}
