// Paquete: com.chicharronesweb.pedidosapi.service
package com.chicharronesweb.pedidosapi.service;

import com.chicharronesweb.pedidosapi.entity.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> findAll();
    Optional<Producto> findById(Integer id);
    Producto save(Producto producto);
    void deleteById(Integer id);
}