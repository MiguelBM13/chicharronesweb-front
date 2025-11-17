// Paquete: com.chicharronesweb.pedidosapi.service
package com.chicharronesweb.pedidosapi.service;

import java.util.List;

import com.chicharronesweb.pedidosapi.dto.PedidoRequestDTO;
import com.chicharronesweb.pedidosapi.entity.Pedido;

public interface PedidoService {
    // El método necesitará saber qué se está pidiendo (el DTO) y quién lo pide (el ID del usuario).
    Pedido crearPedido(PedidoRequestDTO pedidoRequest, Integer usuarioId);

    // Obtener pedidos por usuario
    List<Pedido> obtenerPedidosPorUsuario(Integer usuarioId);

    Pedido actualizarEstado(Integer id, String nuevoEstado);

}
