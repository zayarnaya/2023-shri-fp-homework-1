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

import {
  __,
  allPass,
  any,
  compose,
  converge,
  count,
  countBy,
  dissoc,
  equals,
  gte,
  identity,
  not,
  prop,
  values,
} from "ramda";

// геттеры фигур
// или через propEq?
const getSquare = prop("square");
const getStar = prop("star");
const getCircle = prop("circle");
const getTriangle = prop("triangle");

// цвета
const isWhite = equals("white");
const isBlue = equals("blue");
const isGreen = equals("green");
const isOrange = equals("orange");
const isRed = equals("red");
const getAllColorsQuantity = compose(countBy(identity), values);

// комбинации цветов
const nonWhite = compose(not, isWhite);
const nonRed = compose(not, isRed);
const omitWhite = dissoc("white");

// считалки
const atLeastTwoOutOfFour = gte(__, 2);
const exactlyTwoOutOfFour = equals(__, 2);
const atLeastThreeOutOfFour = gte(__, 3);
const exactlyOne = equals(__, 1);
const allAreSameColor = equals(__, 4);

const countByColor = (color) =>
  compose(
    count((a) => a === color),
    values
  );

const countGreen = countByColor("green");
const countOrange = countByColor("orange");
const countWhite = countByColor("white");
const countRed = countByColor("red");
const countBlue = countByColor("blue");
const countNonWhite = compose(omitWhite, getAllColorsQuantity);

const redStar = compose(isRed, getStar);
const nonRedStar = compose(nonRed, getStar);
const nonWhiteStar = compose(nonWhite, getStar);
const nonWhiteTriange = compose(nonWhite, getTriangle);
const nonWhiteSquare = compose(nonWhite, getSquare);
const greenSquare = compose(isGreen, getSquare);
const orangeSquare = compose(isOrange, getSquare);
const blueCircle = compose(isBlue, getCircle);
const greenTriangle = compose(isGreen, getTriangle);

const checkIfAllAreGreen = compose(allAreSameColor, countGreen);
const checkIfAllAreOrange = compose(allAreSameColor, countOrange);
const checkIfTwoAreGreen = compose(exactlyTwoOutOfFour, countGreen);
const checkIfTwoOrMoreAreGreen = compose(atLeastTwoOutOfFour, countGreen);
const checkIfTwoAreWhite = compose(exactlyTwoOutOfFour, countWhite);
const checkIfOneIsRed = compose(exactlyOne, countRed);
const checkIfBluesEqualsRed = converge(equals, [countRed, countBlue]);
const checkIfThreeOrMoreAreNonWhite = compose(
  any(atLeastThreeOutOfFour),
  values,
  countNonWhite
);
const checkIfStarNonWhiteNorRed = allPass([nonRedStar, nonWhiteStar]);
const sameTriangleAndSquare = converge(equals, [getTriangle, getSquare]);

export const validateFieldN1 = allPass([
  checkIfTwoAreWhite,
  redStar,
  greenSquare,
]);
// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = checkIfTwoOrMoreAreGreen;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = checkIfBluesEqualsRed; 

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([blueCircle, orangeSquare, redStar]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = checkIfThreeOrMoreAreNonWhite;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  checkIfTwoAreGreen,
  greenTriangle,
  checkIfOneIsRed,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = checkIfAllAreOrange;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = checkIfStarNonWhiteNorRed;

// 9. Все фигуры зеленые.
export const validateFieldN9 = checkIfAllAreGreen; // ну надо же работает

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  nonWhiteTriange,
  nonWhiteSquare,
  sameTriangleAndSquare,
]);
