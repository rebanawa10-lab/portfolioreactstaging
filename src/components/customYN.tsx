// file:    src/components/customYN.tsx


interface Props {
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  singleButton?: boolean;
}

export default function CustomConfirm({ message, onConfirm, onCancel, singleButton  }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div>{message}</div>
        {/* <p>{message}</p> */}
        <div className="modal-buttons">
          {singleButton ? (
            <button className="my-buttonYN" onClick={onConfirm}>OK</button>
          ) : (
            <>
              <button className="my-buttonYN" onClick={onConfirm}>Yes</button>
              <button className="my-buttonYN" onClick={onCancel}>No</button>
            </>
          )}
        </div>

        {/* <div className="modal-buttons">
          <button className="my-buttonYN" onClick={onConfirm}>Yes</button>
          <button className="my-buttonYN" onClick={onCancel}>No</button>
        </div> */}

      </div>
    </div>
  );
}