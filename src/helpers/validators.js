/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { __, allPass, anyPass, compose, count, countBy, equals, gte, identity, not, pipe, prop, propEq, values } from "ramda";

// геттеры фигур
// или через propEq?
const getSquare = prop('square');
const getStar = prop('star');
const getCircle = prop('circle');
const getTriangle = prop('triangle');

// цвета
const isWhite = equals('white');
const isBlue = equals("blue");
const isGreen = equals("green");
const isOrange = equals("orange");
const isRed = equals("red");

// комбинации цветов
const nonWhite = not(isWhite); // господи какой бред
const sameColorNonWhite = false //  
// const colorsInTest = compose()

// считалки
const atLeastTwoOutOfFour = gte(__, 2);
const exactlyTwoOutOfFour = equals(__, 2);
const noneOutOfFour = equals(__, 0);
const equalQuantity = equals(__, __); // не, надо арг
const threeOutOfFour = gte(__, 3);
const exactlyOne = equals(__, 1);
const getAllColors = function() {
    // console.log(arguments);
    return Object.values(arguments[0])
    // return true;
}
const getAllColorsQuantity = function() {
    const res = {}
    for (let i of Object.values(arguments[0])) {
        if (res[i]) res[i] = 0;
        res[i]++;
    }
    // console.log(arguments);
    return res;
    // return true;
}

const allSameColor = function() {
    console.log(arguments);
    // console.log(color);
    // console.log(args);
    // console.log(propEq(color, 4));
    // console.log(Object.values(arguments[0]));
    // const colors = Object.values(arguments[0]);
    // const colorCheck = a => {
    //     console.log(a, color);
    //     console.log(a === color);
    //     return a === color;
    // }
    // console.log(count(colorCheck, colors));
    // // return count(color, Object.values(arguments[0])); // к-во той же проп = 4?
    return true;
}


const consoleLogArgs = function() {
    console.log(arguments);
    // return allSameColor('green');
    // console.log(count(a => a === 'green', arguments[0]), 4)
    return true;
}

const countByColor = (color) => compose(count(a => a === color), getAllColors);

const countGreen = countByColor('green'); 
const countOrange = countByColor('orange');
const countWhite = countByColor('white');
const countRed = countByColor('red');
const countBlue = countByColor('blue');
const checkIfBluesEqualsRed = ({red, blue}) => equals(red, blue);

const allAreSameColor = equals(__, 4);
// const bluesEqualsReds = ([red, blue]) => {
//     console.log(red, blue);
//     return equals(red, blue);
// }
// const redEqualsBlue = ({blue, red}) => blue === red;

const checkIfAllAreGreen = compose(allAreSameColor, countGreen);
const checkIfAllAreOrange = compose(allAreSameColor, countOrange);
const checkUfTwoAreGreen = compose(exactlyTwoOutOfFour, countGreen);
const checkIfTwoOrMoreAreGreen = compose(atLeastTwoOutOfFour, countGreen);
const checkIfTwoAreWhite = compose(exactlyTwoOutOfFour, countWhite);
const checkIfOneIsRed = compose(exactlyOne, countRed);

const redStar = compose(isRed, getStar);
const greenSquare = compose(isGreen, getSquare);
const orangeSquare = compose(isOrange, getSquare);
const blueCircle = compose(isBlue, getCircle);
const greenTriangle = compose(isGreen, getTriangle);
// const numberOfColors = compose(countBy(identity), values);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
// export const validateFieldN1 = ({star, square, triangle, circle}) => {
//     if (triangle !== 'white' || circle !== 'white') {
//         return false;
//     }

//     return star === 'red' && square === 'green';
// };
export const validateFieldN1 = allPass([checkIfTwoAreWhite, redStar, greenSquare]);
// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = checkIfTwoOrMoreAreGreen;

// !! 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(checkIfBluesEqualsRed, getAllColorsQuantity); // так работает но надо упростить

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([blueCircle, orangeSquare, redStar]);

// !!5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => false;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([checkUfTwoAreGreen, greenTriangle, checkIfOneIsRed]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = checkIfAllAreOrange;

// !!8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
export const validateFieldN9 = checkIfAllAreGreen; // ну надо же работает

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = () => false;
