// Paquete: com.chicharronesweb.pedidosapi.service
package com.chicharronesweb.pedidosapi.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chicharronesweb.pedidosapi.dto.PedidoRequestDTO;
import com.chicharronesweb.pedidosapi.entity.DetallePedido;
import com.chicharronesweb.pedidosapi.entity.Pedido;
import com.chicharronesweb.pedidosapi.entity.Producto;
import com.chicharronesweb.pedidosapi.entity.Usuario;
import com.chicharronesweb.pedidosapi.repository.PedidoRepository;
import com.chicharronesweb.pedidosapi.repository.ProductoRepository;
import com.chicharronesweb.pedidosapi.repository.UsuarioRepository;
import com.chicharronesweb.pedidosapi.service.NotificacionService;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
private NotificacionService notificacionService;

    @Override
    public List<Pedido> obtenerPedidosPorUsuario(Integer usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaHoraDesc(usuarioId);
    }

    @Override
    public Pedido actualizarEstado(Integer id, String nuevoEstado) {
    Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

    pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado.toUpperCase()));
    Pedido actualizado = pedidoRepository.save(pedido);

    // Generar notificación
    notificacionService.crearNotificacion(
        pedido.getUsuario(),
        "Estado de pedido",
        "Tu pedido #" + pedido.getId() + " ahora está en estado: " + nuevoEstado
    );

    return actualizado; }


    @Override
    @Transactional // Anotación clave: si algo falla, toda la operación se deshace (rollback).
    public Pedido crearPedido(PedidoRequestDTO pedidoRequest, Integer usuarioId) {
        // 1. Obtener el usuario que hace el pedido.
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Crear la cabecera del pedido.
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFechaHora(LocalDateTime.now());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal totalPedido = BigDecimal.ZERO;

        // 3. Procesar cada ítem del "carrito" (DTO).
        for (var detalleDto : pedidoRequest.getDetalles()) {
            // Buscar el producto en la BD para obtener su precio actual.
            Producto producto = productoRepository.findById(detalleDto.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: ID " + detalleDto.getProductoId()));

            // Crear el detalle del pedido.
            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDto.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio()); // Usamos el precio de la BD.
            detalle.setPedido(pedido); // Vinculamos el detalle con su cabecera.
            
            detalles.add(detalle);

            // 4. Calcular el subtotal y sumarlo al total general.
            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(detalleDto.getCantidad()));
            totalPedido = totalPedido.add(subtotal);
        }

        // 5. Asignar la lista de detalles y el total al pedido.
        pedido.setDetalles(detalles);
        pedido.setTotal(totalPedido);

        // 6. Guardar el pedido. Gracias a CascadeType.ALL, los detalles se guardan automáticamente.
        return pedidoRepository.save(pedido);
    }
}