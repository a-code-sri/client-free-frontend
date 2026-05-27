export default function ProgressScanner({ progress }) {
  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p style={{ marginTop: 10 }}>
        Profile Completion: {progress}%
      </p>
    </div>
  );
}