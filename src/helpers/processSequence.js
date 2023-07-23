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
 import { __, allPass, andThen, assoc, compose, concat, gt, gte, lt, otherwise, partial, pipe, tap, test, toString } from 'ramda';
import Api from '../tools/api';

 const api = new Api();

 /**
  * Я – пример, удали меня
  */
 const wait = time => new Promise(resolve => {
     setTimeout(resolve, time);
 })

 const regExp = /^\d*\.?\d*$/;

 // приведение типов
// const numToString = (num) => toString(num);
const stringToNum = (str) => Number(str.trim()); // тут бы еще ошибку отслеживать
const countChars = (str) => str.length;
const roundNum = (num) => Math.round(num);

// считалки
const lessThanTen = lt(__, 10);
const greaterThanTwo = gt(__, 2);
const greaterThanZero = gt(__, 0);
const toSquare = (num) => num * num;
const restFromDivByThree = (num) => num % 3;

// валидашки
 // количество символов в числе меньше 10
 const qOfFiguresLessThanTen = pipe(countChars, lessThanTen);
 // количество символов в числе больше 2
 const qOfFiguresMoreThanTwo = pipe(countChars, greaterThanTwo);
 // в числе цифры 0-9 и точка 
 const isDecimal = test(regExp);
 // число положительное - излишне, через регексп все равно не пролезет
//  const isPositive = pipe(stringToNum, greaterThanZero);
 // валидация
 const isValid = allPass([qOfFiguresLessThanTen, qOfFiguresMoreThanTwo, isDecimal]);

 // промисы и then
 const getLengthFromResponse = andThen(countChars);
 const getRestFromDivByThree = andThen(restFromDivByThree);
 const getSquaredNum = andThen(toSquare);
 const getNumFromString = andThen(stringToNum);


 // API
 const NUMBERS = 'https://api.tech/numbers/base';
 const ANIMALS = 'https://animals.tech/';
 const NUMBER_PARAMS = {
    from: 2, 
    to: 10
};

 const addParamForNumbers = assoc('number', __, NUMBER_PARAMS);
 const decToBin = pipe(addParamForNumbers, api.get(NUMBERS));

 const addQueryParamsForAnimals = andThen(concat(ANIMALS));
 const getRandomAnimal = andThen(api.get(__, {}));




 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const writeToLog = tap(writeLog);
    const writeRespToLog = andThen(writeToLog);
    const onSuccess = andThen(handleSuccess);
    const onError = otherwise(handleError);
    const onValidationError = partial(handleError, ['ValidationError']);

    const letsGo = pipe(
        // убедиться, что все что надо идет через then
        writeToLog,
        isValid,
        stringToNum,
        roundNum,
        writeToLog,
        decToBin, // передать результат как строку? result
        writeRespToLog,
        getLengthFromResponse,
        writeRespToLog,
        getNumFromString,
        getSquaredNum,
        writeRespToLog,
        getRestFromDivByThree,
        writeRespToLog,
        addQueryParamsForAnimals,
        getRandomAnimal,
        onSuccess,
        onError
    );

     writeLog(value);

     

     api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: '01011010101'}).then(({result}) => {
         writeLog(result);
     });

     wait(2500).then(() => {
         writeLog('SecondLog')

         return wait(1500);
     }).then(() => {
         writeLog('ThirdLog');

         return wait(400);
     }).then(() => {
         handleSuccess('Done');
     });
 }

export default processSequence;
