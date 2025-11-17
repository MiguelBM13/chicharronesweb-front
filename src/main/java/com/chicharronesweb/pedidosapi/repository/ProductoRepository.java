// Paquete: com.chicharronesweb.pedidosapi.repository
package com.chicharronesweb.pedidosapi.repository;

import com.chicharronesweb.pedidosapi.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
   
}