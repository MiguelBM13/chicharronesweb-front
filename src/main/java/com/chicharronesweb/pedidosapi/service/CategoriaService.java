package com.chicharronesweb.pedidosapi.service;

import com.chicharronesweb.pedidosapi.entity.Categoria;
import java.util.List;
import java.util.Optional;

public interface CategoriaService {
    List<Categoria> findAll();
    Optional<Categoria> findById(Integer id);
    Categoria save(Categoria categoria);
    void deleteById(Integer id);
}
