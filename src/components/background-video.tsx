export const BackgroundVideo = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video className="w-full h-full object-cover" autoPlay loop muted>
        {/* <source src="/video.mp4" type="video/mp4" /> */}
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <div className="absolute inset-0 bg-black bg-opacity-50" /> */}
    </div>
  );
};
