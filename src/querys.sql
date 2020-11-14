/* mostrar los procesos asignados a un diente cusno se da click en el  */
select sp.id, sp.nombre, e.nombres 
    from expediente_proceso as ep inner join sub_proceso as sp on(sp.id = ep.subProceso)
        inner join proceso as p on(sp.proceso=p.id)
            inner join dientes as d on(ep.diente=d.nDiente)
                inner join expediente as e on(e.id=ep.expediente)
                    where e.id = 1 and d.nDiente = 18 and p.id = 1;


/* mostrar los datos del expediente en los dientes*/
select sp.id, sp.nombre, p.id, p.forma, d.nDiente, e.id as expediente 
from expediente_proceso as ep inner join sub_proceso as sp on(sp.id = ep.subProceso)
        inner join proceso as p on(sp.proceso=p.id)
            inner join dientes as d on(ep.diente=d.nDiente)
                inner join expediente as e on(e.id=ep.expediente)
                    where e.id = 1;    

/*mostrar historial medico segun expediente*/
select sp.nombre, d.nDiente, d.nombre as descripcion , e.id as expediente 
from expediente_proceso as ep inner join sub_proceso as sp on(sp.id = ep.subProceso)
        inner join proceso as p on(sp.proceso=p.id)
            inner join dientes as d on(ep.diente=d.nDiente)
                inner join expediente as e on(e.id=ep.expediente)
                    where e.id = 6;    

/* mostrar subprocesos segun diente, expediente y proceso */
select sp.nombre 
    from sub_proceso as sp inner join expediente_proceso ep on(ep.subProceso=sp.id)
        inner join expediente as e on(ep.expediente=e.id)
            inner join proceso as p on(p.id=sp.proceso)
                inner join dientes as d on(d.nDiente=ep.diente)
                    where e.id = 1 and d.nDiente = 17 and p.nombre = 2;

     /* -------------------------------- consultas de desarrollo ------------------------------------- */


select * from expediente_proceso;

show tables;

select * from proceso;

select * from sub_proceso;



