package com.chicharronesweb.pedidosapi.service;

import com.chicharronesweb.pedidosapi.dto.CalificacionPedidoDTO;
import com.chicharronesweb.pedidosapi.entity.CalificacionPedido;
import com.chicharronesweb.pedidosapi.entity.Pedido;
import com.chicharronesweb.pedidosapi.repository.CalificacionPedidoRepository;
import com.chicharronesweb.pedidosapi.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CalificacionPedidoServiceImpl implements CalificacionPedidoService {

    @Autowired
    private CalificacionPedidoRepository calificacionRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Override
    public CalificacionPedido registrarCalificacion(CalificacionPedidoDTO dto) {
        // 1️⃣ Buscar el pedido
        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // 2️⃣ Validar que el pedido esté LISTO
        if (pedido.getEstado() != Pedido.EstadoPedido.LISTO) {
            throw new RuntimeException("Solo se pueden calificar pedidos con estado LISTO");
        }

        // 3️⃣ Verificar si ya existe una calificación para este pedido
        Optional<CalificacionPedido> existente = calificacionRepository.findByPedidoId(dto.getPedidoId());

        CalificacionPedido calificacion;

        if (existente.isPresent()) {
            // ✅ Si existe, ACTUALIZAR la calificación
            calificacion = existente.get();
            calificacion.setPuntuacion(dto.getPuntuacion());
            calificacion.setComentario(dto.getComentario());
            calificacion.setFechaRegistro(LocalDateTime.now()); // Actualizar fecha
        } else {
            // ✅ Si no existe, CREAR nueva calificación
            calificacion = new CalificacionPedido();
            calificacion.setPuntuacion(dto.getPuntuacion());
            calificacion.setComentario(dto.getComentario());
            calificacion.setFechaRegistro(LocalDateTime.now());
            calificacion.setPedido(pedido);
        }

        // 4️⃣ Guardar y devolver
        return calificacionRepository.save(calificacion);
    }

    @Override
    public Optional<CalificacionPedido> obtenerCalificacionPorPedido(Integer pedidoId) {
        return calificacionRepository.findByPedidoId(pedidoId);
    }
}