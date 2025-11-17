package com.chicharronesweb.pedidosapi.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.chicharronesweb.pedidosapi.entity.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    @Query("SELECT p FROM Pedido p ORDER BY CASE WHEN p.estado = 'ENTREGADO' THEN 1 ELSE 0 END, p.fechaHora ASC")
    List<Pedido> findAllOrderByFechaAndEntregadoLast();

    List<Pedido> findByUsuarioIdOrderByFechaHoraDesc(Integer usuarioId);
}