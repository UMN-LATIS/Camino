export default ({ tour, stopIndex }) =>
  tour?.stops[stopIndex]?.stop_content?.stages || [];
