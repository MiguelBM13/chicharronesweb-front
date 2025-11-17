package com.chicharronesweb.pedidosapi.repository;

import com.chicharronesweb.pedidosapi.entity.CalificacionPedido;
import com.chicharronesweb.pedidosapi.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CalificacionPedidoRepository extends JpaRepository<CalificacionPedido, Integer> {

    Optional<CalificacionPedido> findByPedidoId(Integer pedidoId);
    // Opcional
    Optional<CalificacionPedido> findByPedido(Pedido pedido);
}
