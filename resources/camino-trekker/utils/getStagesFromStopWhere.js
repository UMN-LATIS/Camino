export default (stageKey, stageValue, stop) => {
  return stop.stop_content.stages.filter(
    (stage) => stage[stageKey] === stageValue
  );
};
