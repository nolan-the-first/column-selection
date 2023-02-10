const CorrectlySentNotification = () => {
  return (
    <div
      className="absolute top-6 right-6 animate-fadeInLeft p-6 text-xl font-bold bg-green rounded-xl"
      style={{
        animationTimingFunction: "ease-out",
        animationDuration: "500ms",
      }}
    >
      Sent Correctly !!
    </div>
  );
};

export default CorrectlySentNotification;
