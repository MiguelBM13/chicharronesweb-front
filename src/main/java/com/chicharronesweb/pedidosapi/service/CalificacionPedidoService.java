package com.chicharronesweb.pedidosapi.service;

import com.chicharronesweb.pedidosapi.dto.CalificacionPedidoDTO;
import com.chicharronesweb.pedidosapi.entity.CalificacionPedido;

import java.util.Optional;

public interface CalificacionPedidoService {
    CalificacionPedido registrarCalificacion(CalificacionPedidoDTO calificacion);
    Optional<CalificacionPedido> obtenerCalificacionPorPedido(Integer pedidoId);
}
