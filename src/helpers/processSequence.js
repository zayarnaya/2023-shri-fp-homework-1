/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  __,
  allPass,
  andThen,
  assoc,
  concat,
  gt,
  ifElse,
  lt,
  modulo,
  otherwise,
  partial,
  pipe,
  prop,
  tap,
  test,
  toString,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const regExp = /^\d*\.?\d*$/;

const countChars = (str) => str.length;
const roundNum = (num) => Math.round(num);
const lessThanTen = lt(__, 10);
const greaterThanTwo = gt(__, 2);
const toSquare = (num) => num * num;
const restFromDivByThree = modulo(__, 3); 

// валидашки
// количество символов в числе меньше 10
const qOfFiguresLessThanTen = pipe(countChars, lessThanTen);
// количество символов в числе больше 2
const qOfFiguresMoreThanTwo = pipe(countChars, greaterThanTwo);
// в числе цифры 0-9 и точка
const isDecimal = test(regExp);
// число положительное - излишне, через регексп все равно не пролезет

// валидация
const isValid = allPass([
  qOfFiguresLessThanTen,
  qOfFiguresMoreThanTwo,
  isDecimal,
]);

// промисы и then
const getLengthFromResponse = andThen(countChars);
const getRestFromDivByThree = andThen(restFromDivByThree);
const getSquaredNum = andThen(toSquare);
const getNumFromString = andThen(Number);

// API
const NUMBERS = "https://api.tech/numbers/base";
const ANIMALS = "https://animals.tech/";
const NUMBER_PARAMS = {
  from: 10,
  to: 2,
};

const addParamForNumbers = assoc("number", __, NUMBER_PARAMS);
const decToBin = pipe(addParamForNumbers, api.get(NUMBERS, __));

const addQueryParamsForAnimals = pipe(
  andThen(String),
  andThen(concat(ANIMALS))
);
const getRandomAnimal = andThen(api.get(__, {}));
const getResponse = andThen(prop("result"));

// основная функция
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const writeToLog = tap(writeLog);
  const writeRespToLog = andThen(writeToLog);
  const onSuccess = andThen(handleSuccess);
  const onError = otherwise(handleError);
  const onValidationError = partial(handleError, ["ValidationError"]);

  // композиции/трубы с writeLog
  const action3 = pipe(Number, roundNum, toString, writeToLog);
  const action4 = pipe(decToBin, getResponse, writeRespToLog);
  const action5 = pipe(getLengthFromResponse, writeRespToLog);
  const action6 = pipe(getNumFromString, getSquaredNum, writeRespToLog);
  const action7 = pipe(getRestFromDivByThree, writeRespToLog);
  const action8 = pipe(addQueryParamsForAnimals, getRandomAnimal, getResponse);

  const performMainTask = pipe(
    action3,
    action4,
    action5,
    action6,
    action7,
    action8,
    onSuccess,
    onError
  );
  // первоначальная проверка валидности инпута
  const checkInitialInput = ifElse(isValid, performMainTask, onValidationError);
  const letsGo = pipe(writeToLog, checkInitialInput);

  letsGo(value);
};

export default processSequence;
// получилось длиииииинное и непонятное
