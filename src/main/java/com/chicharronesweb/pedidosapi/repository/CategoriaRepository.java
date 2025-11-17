// Paquete: com.chicharronesweb.pedidosapi.repository
package com.chicharronesweb.pedidosapi.repository;

import com.chicharronesweb.pedidosapi.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // Con solo extender JpaRepository, Spring Data JPA nos proporciona automáticamente
    // los métodos CRUD básicos como findAll(), findById(), save(), deleteById(), etc.
    // No es necesario escribir ninguna implementación aquí.
}
