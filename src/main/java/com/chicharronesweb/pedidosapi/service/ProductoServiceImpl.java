// Paquete: com.chicharronesweb.pedidosapi.service
package com.chicharronesweb.pedidosapi.service;

import com.chicharronesweb.pedidosapi.entity.Producto;
import com.chicharronesweb.pedidosapi.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Le decimos a Spring que esta clase es un servicio
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    @Transactional(readOnly = true) // Transacción de solo lectura, es más eficiente
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id);
    }

    @Override
    @Transactional // Transacción de escritura (crear o actualizar)
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional // Transacción de escritura (eliminar)
    public void deleteById(Integer id) {
        productoRepository.deleteById(id);
    }
}