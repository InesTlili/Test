var moment = require('moment');
moment.suppressDeprecationWarnings = true;



function timestamp_to_date(number){
  var day = moment.unix(number).utc().format('LLL');
  return(day);
}

function string_to_date(string){
  return(moment(string,'h:mm a').format('LT'));

}


function periods(startWindow,endWindow,startDay,endDay){
  //Convertir les inputs
  startWindow=timestamp_to_date(startWindow);
  endWindow=timestamp_to_date(endWindow);
  startDay = string_to_date(startDay);
  endDay = string_to_date(endDay);

  //Déclaration des tableaux ou on va stocker les débuts et fins des nocturnes
  startNight = []
  endNight = []

  //Calcul de la durée de la nuit et la durée du jour
  dayDuration = moment.duration(moment(startDay).diff(endDay)).minutes();
  nightDuration = moment.duration(moment(endDay).diff(startDay)).minutes();

  //Evaluation de la valeur initiale startWindow et initialisation du tableau startNight
  if (moment(startWindow).format('LT')>endDay && moment(startWindow).format('LT')<startDay)
  {
    startNight.push(moment(startWindow).format('LLL'));
  }

  //Initialisation de "l'itérateur"
  m = moment(startWindow);
  //Boucler sur m
  while (m.isBefore(endWindow)){
    //Si c'est le début de la nuit, ajouter à startNight et incrémenter par la durée de la nuit
    if (m.format('LT') == endDay)
    {
      startNight.push(m.format('LLL')) //ajout de m à startNight
      m.add(nightDuration,'minutes') //incrémentation par la durée de la nuit
    }
    //Si c'est le début du jour, ajouter à endNight et incrémenter par la durée de la journée
    else if ((m.format('LT') == startDay))
    {
      endNight.push(m.format('LLL')) //ajout de m à endNight
      m.add(dayDuration,'minutes') //incrémentation par la durée de la journée
    }
    //incrémentation par une minute au cas ou on est pas encore dans endDay ou startDay
    m.add(1,'minutes')
  }

  //Evaluation de la valeur finale endWindow
  if (moment(endWindow).format('LT')>endDay && moment(endWindow).format('LT')<startDay)
  {
    endNight.push(moment(endWindow).format('LLL'));
  }
  return([startNight,endNight])
}

//Affichage de résultats
function showperiods(startWindow,endWindow,startDay,endDay)
{
  startNight = periods(startWindow,endWindow,startDay,endDay)[0]
  endNight = periods(startWindow,endWindow,startDay,endDay)[1]

  for (i = 0; i < startNight.length; i++)

  {
    j=i+1
    console.log('Nocture '+j+' :   De '+startNight[i]+' à :'+endNight[i]+'\n')
  }
}

console.log("Test Case 1 : \n")
showperiods(1551330000,1551567600,"08:00","22:00")
console.log("Test Case 2 : \n")
showperiods(1551330000,1551567600,"08:00","06:00")
