
// FUNCTION TO CALCULATE AND SET THE TOTAL MILEAGE OF EACH ROUTE
function setTotalMileageOfRoutes(routes){
  var completeRoutes = [];
  for (index in routes){
    var route = routes[index];
    // CALCULATING THE TOTAL OF MILEAGE COVERED
    var total = route.end_mileage - route.start_mileage;

    route = {
      _id: route._id,
      from_location: route.from_location,
      to_location: route.to_location,
      start_mileage: route.start_mileage,
      end_mileage: route.end_mileage,
      user: route.user,
      total_miles: total,
    };
    completeRoutes.push(route);
  }
  return completeRoutes;
}

module.exports = {
  setTotalMileageOfRoutes: setTotalMileageOfRoutes
}
