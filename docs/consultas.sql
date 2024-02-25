--1. **Empleados ordenados alfabéticamente (Z...A):**  
SELECT nombre FROM empleados ORDER BY nombre DESC;

--2. **Empleados de Soporte:**  
SELECT empleados.nombre, puestos.puesto, localidades.localidad 
FROM empleados  
JOIN puestos ON empleados.puesto_id = puestos.id
JOIN departamentos ON empleados.departamentos_id = departamentos.id
JOIN localidades ON departamentos.localidad_id = localidades.id
WHERE puestos.puesto = "Soporte" ;

--3. **Nombres que terminan con 'o':**  
SELECT nombre FROM empleados WHERE nombre LIKE "%o";

--4. **Empleados en Carlos Paz:**  
SELECT empleados.nombre, empleados.sueldo, localidades.localidad 
FROM empleados 
JOIN departamentos ON empleados.departamentos_id = departamentos_id
JOIN localidades ON departamentos.localidad_id = localidad_id
WHERE localidades.localidad = "Carlos Paz";

--5. **Sueldos entre 10000 y 13000:** 
SELECT empleados.nombre, empleados.sueldo, localidades.localidad 
FROM empleados 
JOIN departamentos ON empleados.departamentos_id = departamentos_id
JOIN localidades ON departamentos.localidad_id = localidad_id
WHERE empleados.sueldo BETWEEN 10000 AND 13000;

--6. **Departamentos con más de 5 empleados:** 
SELECT departamentos.denominacion, COUNT(empleados.id) as cantidad_empleados
FROM empleados
JOIN departamentos ON empleados.departamentos_id = departamentos_id
GROUP BY departamentos.denominacion
HAVING cantidad_empleados > 5 ;

--7. **Empleados en Córdoba con puesto de Analista o Programador:**  
SELECT empleados.nombre
FROM empleados
JOIN puestos ON empleados.puesto_id = puestos.id
JOIN departamentos ON empleados.departamentos_id = departamentos.id
JOIN localidades ON departamentos.localidad_id = localidades.id
WHERE localidades.localidad = "Cordoba" AND (puestos.puesto = "Analista" OR puestos.puesto = "Programador");

--8. **Sueldo medio de todos los empleados:**  
SELECT AVG(sueldo) AS sueldo_medio FROM empleados;

--9. **Máximo sueldo en el departamento 10:**  
SELECT MAX(sueldo) AS sueldo_maximo FROM empleados 
WHERE departamento_id = 10;

--10. **Sueldo mínimo en el departamento Soporte:**  
SELECT MIN(empleados.sueldo) AS sueldo_minimo FROM empleados
JOIN departamentos ON empleados.departamentos_id = departamentos.id
WHERE departamentos.denominacion = "Soporte";

--11. **Suma de sueldos por puesto:**  
SELECT puestos.puesto, SUM(empleados.sueldo) AS suma_sueldos
FROM empleados
JOIN puestos ON empleados.puesto_id = puestos.id
GROUP BY puestos.puesto ;




